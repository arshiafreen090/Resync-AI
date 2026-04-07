"""
Session endpoints — the core tailoring API layer.
Handles analysis start, status polling, keyword decisions, 
result fetching, session finalization, and PDF download.
"""
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.core.rate_limit import check_rate_limit, get_rate_headers, increment_usage
from app.core.sanitize import sanitize_answer, sanitize_jd_text
from app.models.tables import (
    KeywordDecision,
    Resume,
    SessionOutput,
    TailoringSession,
    User,
)
from app.services.ai import (
    finalize_tailoring_task,
    process_tailoring_task,
    generate_dashboard_analytics,
)
from app.services.pdf import generate_pdf_from_json
from app.services.storage import generate_r2_signed_url, upload_to_r2

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────
# REQUEST / RESPONSE SCHEMAS
# ─────────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    resume_id: UUID = Field(..., description="ID of an uploaded resume")
    job_description: str = Field(..., min_length=100, description="Raw JD text, min 100 chars")

    @field_validator("job_description")
    @classmethod
    def jd_must_be_substantial(cls, v: str) -> str:
        if len(v.strip()) < 100:
            raise ValueError("Job description must be at least 100 characters.")
        return v


class KeywordDecisionUpdate(BaseModel):
    decision: str = Field(..., pattern="^(accepted|rejected)$")
    clarifying_answer: str | None = Field(default=None, max_length=2000)


# ─────────────────────────────────────────────────────────────────────
# POST /analyze  — Start a new tailoring session
# ─────────────────────────────────────────────────────────────────────

@router.post("/analyze", summary="Start a new tailoring session")
async def start_analysis(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Steps:
    1. Rate limit check
    2. Sanitize JD text
    3. Verify resume ownership
    4. Create TailoringSession record (status: pending)
    5. Queue background AI task
    """
    # 1. Rate limit
    rate_info = await check_rate_limit(current_user.id, current_user.plan)
    for k, v in get_rate_headers(rate_info).items():
        response.headers[k] = v

    # 2. Sanitize JD
    safe_jd = sanitize_jd_text(request.job_description)

    # 3. Verify resume ownership
    stmt = select(Resume).where(
        and_(Resume.id == request.resume_id, Resume.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found. Please upload a resume first via /v1/upload/resume.",
        )
    if not resume.raw_text or not resume.raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="This resume has no extracted text. Please re-upload it via /v1/upload/resume.",
        )

    # 4. Create session
    session = TailoringSession(
        user_id=current_user.id,
        resume_id=request.resume_id,
        jd_text=safe_jd,
        status="pending",
    )
    db.add(session)
    await db.flush()

    # 5. Increment usage + queue background
    await increment_usage(current_user.id)
    background_tasks.add_task(process_tailoring_task, session.id)

    return {
        "session_id": str(session.id),
        "status": "pending",
        "resume_id": str(request.resume_id),
        "resume_name": resume.name,
    }


# ─────────────────────────────────────────────────────────────────────
# GET /{session_id}/status  — Poll session status
# ─────────────────────────────────────────────────────────────────────

@router.get("/{session_id}/status", summary="Poll tailoring session status")
async def get_session_status(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Frontend polls this during the loading screen (~2s intervals).
    When status == 'reviewing', redirect to /tailor/preview.
    """
    stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session not found")

    return {
        "session_id": str(session.id),
        "status": session.status,
        "error_message": session.error_message,
        "initial_ats_score": session.initial_ats_score,
    }


# ─────────────────────────────────────────────────────────────────────
# GET /{session_id}/result  — Full analysis result for Preview page
# ─────────────────────────────────────────────────────────────────────

@router.get("/{session_id}/result", summary="Get full analysis result")
async def get_session_result(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns everything the Preview page needs:
    - JD breakdown (parsed by AI)
    - Initial ATS score
    - Match summary (counts)
    - Session metadata
    """
    stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session not found")

    if session.status not in ("reviewing", "complete"):
        raise HTTPException(
            409,
            f"Analysis not yet complete. Current status: '{session.status}'. "
            "Keep polling /status.",
        )

    # Keyword counts for match summary
    kw_stmt = select(KeywordDecision).where(KeywordDecision.session_id == session_id)
    kw_result = await db.execute(kw_stmt)
    all_kws = kw_result.scalars().all()

    match_summary = {
        "total": len(all_kws),
        "contextual": sum(1 for k in all_kws if k.match_type == "contextual"),
        "modification": sum(1 for k in all_kws if k.match_type == "modification"),
        "addition": sum(1 for k in all_kws if k.match_type == "addition"),
        "not_applicable": sum(1 for k in all_kws if k.match_type == "not_applicable"),
    }

    return {
        "session_id": str(session.id),
        "status": session.status,
        "initial_ats_score": session.initial_ats_score,
        "final_ats_score": session.final_ats_score,
        "jd_breakdown": session.jd_parsed_json,
        "match_summary": match_summary,
    }


# ─────────────────────────────────────────────────────────────────────
# GET /{session_id}/keywords  — Keyword decisions for Keyword Review page
# ─────────────────────────────────────────────────────────────────────

@router.get("/{session_id}/keywords", summary="Get keyword decisions for review")
async def get_keywords(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns all pending keyword decisions for the Keyword Review page.
    Frontend groups these by `section`.
    """
    # Verify ownership first
    sess_stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    sess_result = await db.execute(sess_stmt)
    session = sess_result.scalar_one_or_none()
    if not session:
        raise HTTPException(404, "Session not found")

    kw_stmt = select(KeywordDecision).where(
        KeywordDecision.session_id == session_id
    )
    kw_result = await db.execute(kw_stmt)
    keywords = kw_result.scalars().all()

    return {
        "session_id": str(session_id),
        "keywords": [
            {
                "id": str(kw.id),
                "session_id": str(kw.session_id),
                "keyword": kw.keyword,
                "match_type": kw.match_type,
                "user_decision": kw.user_decision,
                "section": kw.section,
                "placement": kw.placement,
                "original_bullet": kw.original_bullet,
                "modified_bullet": kw.modified_bullet,
                "added_bullet": kw.added_bullet,
                "reasoning": kw.reasoning,
                "clarifying_question": kw.clarifying_question,
                "clarifying_answer": kw.clarifying_answer,
            }
            for kw in keywords
        ],
    }


# ─────────────────────────────────────────────────────────────────────
# PATCH /{session_id}/keywords/{keyword_id}  — Accept/reject a keyword
# ─────────────────────────────────────────────────────────────────────

@router.patch(
    "/{session_id}/keywords/{keyword_id}",
    summary="Accept or reject a keyword decision",
)
async def update_keyword_decision(
    session_id: UUID,
    keyword_id: UUID,
    body: KeywordDecisionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Called when user clicks Accept / Reject on a keyword card.
    Validates that the session belongs to the current user.
    For 'contextual' keywords, the clarifying_answer is saved here.
    """
    # Ownership check via session
    sess_stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    sess_result = await db.execute(sess_stmt)
    session = sess_result.scalar_one_or_none()
    if not session:
        raise HTTPException(404, "Session not found")

    # Load keyword
    kw_stmt = select(KeywordDecision).where(
        and_(
            KeywordDecision.id == keyword_id,
            KeywordDecision.session_id == session_id,
        )
    )
    kw_result = await db.execute(kw_stmt)
    kw = kw_result.scalar_one_or_none()
    if not kw:
        raise HTTPException(404, "Keyword not found")

    # Validate contextual keywords require an answer to accept
    if (
        body.decision == "accepted"
        and kw.match_type == "contextual"
        and not (body.clarifying_answer or "").strip()
    ):
        raise HTTPException(
            422,
            "A clarifying answer is required to accept a contextual keyword.",
        )

    kw.user_decision = body.decision
    kw.decided_at = datetime.now(timezone.utc)
    if body.clarifying_answer:
        kw.clarifying_answer = sanitize_answer(body.clarifying_answer)

    return {
        "id": str(kw.id),
        "user_decision": kw.user_decision,
        "clarifying_answer": kw.clarifying_answer,
    }


# ─────────────────────────────────────────────────────────────────────
# POST /{session_id}/finalize  — Trigger resume tailoring after review
# ─────────────────────────────────────────────────────────────────────

@router.post("/{session_id}/finalize", summary="Finalize resume after keyword review")
async def finalize_session(
    session_id: UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Called when user clicks "Finish Review" on the Keyword Review page.
    Triggers the final tailoring AI task (bullet rewriting + resume assembly).
    Frontend then polls /status until status == 'complete'.
    """
    stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(404, "Session not found")

    if session.status not in ("reviewing",):
        raise HTTPException(
            409,
            f"Cannot finalize a session with status '{session.status}'. "
            "Session must be in 'reviewing' state.",
        )

    background_tasks.add_task(finalize_tailoring_task, session_id)

    return {"session_id": str(session_id), "status": "analyzing"}


# ─────────────────────────────────────────────────────────────────────
# GET /{session_id}/tailored-resume  — Tailored resume JSON for Editor page
# ─────────────────────────────────────────────────────────────────────

@router.get("/{session_id}/tailored-resume", summary="Get tailored resume JSON")
async def get_tailored_resume(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """The Editor page fetches this to render the tailored vs original comparison."""
    # Verify ownership
    sess_stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    sess_result = await db.execute(sess_stmt)
    session = sess_result.scalar_one_or_none()
    if not session:
        raise HTTPException(404, "Session not found")

    if session.status != "complete":
        raise HTTPException(
            409,
            "Tailored resume not ready yet. Status: " + session.status,
        )

    # Fetch output
    out_stmt = select(SessionOutput).where(SessionOutput.session_id == session_id)
    out_result = await db.execute(out_stmt)
    output = out_result.scalar_one_or_none()

    if not output:
        raise HTTPException(404, "Tailored resume output not found")

    # Also get original resume for comparison
    original_text = ""
    if session.resume_id:
        r_stmt = select(Resume).where(Resume.id == session.resume_id)
        r_result = await db.execute(r_stmt)
        r_obj = r_result.scalar_one_or_none()
        if r_obj:
            original_text = r_obj.raw_text or ""

    return {
        "session_id": str(session_id),
        "final_ats_score": session.final_ats_score,
        "initial_ats_score": session.initial_ats_score,
        "tailored_resume": output.tailored_resume_json,
        "original_text_preview": original_text[:500],
    }


# ─────────────────────────────────────────────────────────────────────
# GET /{session_id}/download-pdf  — Signed PDF URL
# ─────────────────────────────────────────────────────────────────────

@router.get("/{session_id}/download-pdf", summary="Download tailored resume as PDF")
async def download_tailored_pdf(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Generates the tailored PDF if not cached, uploads to R2,
    returns a 15-minute signed URL. Never returns a permanent public URL.
    """
    # Ownership
    stmt = select(TailoringSession).where(
        and_(
            TailoringSession.id == session_id,
            TailoringSession.user_id == current_user.id,
        )
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(403, "Access denied")

    # Get output
    out_stmt = select(SessionOutput).where(SessionOutput.session_id == session_id)
    out_result = await db.execute(out_stmt)
    output = out_result.scalar_one_or_none()

    if not output or not output.tailored_resume_json:
        raise HTTPException(404, "Tailoring not complete yet")

    # Generate and cache PDF
    if not output.tailored_pdf_url:
        try:
            pdf_bytes = generate_pdf_from_json(output.tailored_resume_json)
            key = f"pdfs/{current_user.id}/{session_id}/tailored.pdf"
            upload_to_r2(key, pdf_bytes, content_type="application/pdf")
            output.tailored_pdf_url = key
            output.pdf_generated_at = datetime.now(timezone.utc)
            await db.commit()
        except RuntimeError as e:
            raise HTTPException(500, str(e))

    signed_url = generate_r2_signed_url(output.tailored_pdf_url, expires_in=900)

    return {
        "url": signed_url,
        "expires_in": 900,
        "filename": f"ReSync_Tailored_Resume_{str(session_id)[:8]}.pdf",
    }


# ─────────────────────────────────────────────────────────────────────
# GET /history  — User's past sessions
# ─────────────────────────────────────────────────────────────────────

@router.get("/history", summary="List user's tailoring session history")
async def get_session_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns all sessions for the current user, newest first."""
    stmt = (
        select(TailoringSession)
        .where(TailoringSession.user_id == current_user.id)
        .order_by(TailoringSession.created_at.desc())
        .limit(50)
    )
    result = await db.execute(stmt)
    sessions = result.scalars().all()

    return {
        "sessions": [
            {
                "session_id": str(s.id),
                "status": s.status,
                "initial_ats_score": s.initial_ats_score,
                "final_ats_score": s.final_ats_score,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "resume_id": str(s.resume_id) if s.resume_id else None,
            }
            for s in sessions
        ]
    }


# ─────────────────────────────────────────────────────────────────────
# GET /analytics  — Dashboard intelligent summary (PROMPT 5)
# ─────────────────────────────────────────────────────────────────────

@router.get("/analytics", summary="Get intelligent dashboard analytics")
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Fetches past session data and runs it through the AI engine to generate
    smart coaching insights, top keywords, and ATS trends.
    """
    # Grab all complete sessions
    stmt = (
        select(TailoringSession)
        .where(
            and_(
                TailoringSession.user_id == current_user.id,
                TailoringSession.status == "complete",
            )
        )
        .order_by(TailoringSession.created_at.asc())
    )
    result = await db.execute(stmt)
    sessions = result.scalars().all()

    if not sessions:
        # Return empty shell if no data yet
        return {
            "total_sessions": 0,
            "average_ats_score": 0,
            "best_session": None,
            "weakest_session": None,
            "top_missing_keywords": [],
            "top_matched_keywords": [],
            "industry_breakdown": [],
            "ats_trend": "insufficient_data",
            "coaching_insight": "Complete your first tailoring session to get personalized insights.",
            "recommended_next_action": "Upload a resume and tailor it for a job.",
        }

    # Format history for Groq
    history_json = []
    for s in sessions:
        jd_parsed = s.jd_parsed_json or {}
        role = jd_parsed.get("role_target", {})
        
        # Load keywords for this session? This could be large. We can just pass the counts to save tokens.
        kw_stmt = select(KeywordDecision).where(KeywordDecision.session_id == s.id)
        kw_result = await db.execute(kw_stmt)
        kws = kw_result.scalars().all()
        
        missing = [k.keyword for k in kws if k.match_type in ("addition", "contextual")]
        matched = [k.keyword for k in kws if k.match_type == "matched"]
        
        history_json.append({
            "session_id": str(s.id),
            "date": s.created_at.isoformat() if s.created_at else "",
            "job_title": role.get("title", "Unknown"),
            "company": role.get("company", "Unknown"),
            "ats_score": s.final_ats_score or s.initial_ats_score or 0,
            "missing_keywords": missing[:10], # Truncate to save tokens
            "matched_keywords": matched[:10]
        })

    today_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    try:
        analytics = await generate_dashboard_analytics(history_json, today_date)
        return analytics
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to generate dashboard analytics: {e}")
        # Fallback empty shell
        return {
            "total_sessions": len(sessions),
            "average_ats_score": 0,
            "best_session": None,
            "weakest_session": None,
            "top_missing_keywords": [],
            "top_matched_keywords": [],
            "industry_breakdown": [],
            "ats_trend": "insufficient_data",
            "coaching_insight": "Analytics temporarily unavailable.",
            "recommended_next_action": "Try checking back later.",
        }
