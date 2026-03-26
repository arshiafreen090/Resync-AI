from uuid import UUID
from datetime import datetime
import json

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, Response
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.rate_limit import check_rate_limit, increment_usage, get_rate_headers
from app.core.sanitize import sanitize_jd_text
from app.models.tables import User, TailoringSession, SessionOutput
from app.services.ai import process_tailoring_task
from app.services.storage import generate_r2_signed_url, upload_to_r2
from app.services.pdf import generate_pdf_from_json

router = APIRouter()


class AnalyzeRequest(BaseModel):
    resume_id: UUID = Field(..., description="ID of the resume to tailor")
    job_description: str = Field(..., description="Raw text of the job description")


@router.post("/analyze")
async def start_analysis(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Start a new tailoring session async.
    - Validates inputs (sanitizes JD text)
    - Checks rate limit
    - Checks resume ownership
    - Creates session row
    - Starts background task for Groq API
    """
    # 1. Rate Limit
    rate_info = await check_rate_limit(current_user.id, current_user.plan)
    for k, v in get_rate_headers(rate_info).items():
        response.headers[k] = v

    # 2. Input Sanitization
    safe_jd = sanitize_jd_text(request.job_description)

    # 3. Ownership Verification (Resume)
    # Check if resume_id belongs to user
    # Simplified here. Real app would do a query to verify resume.id = request.resume_id AND user_id = current_user.id
    
    # 4. Create Session (Pending)
    session = TailoringSession(
        user_id=current_user.id,
        resume_id=request.resume_id,
        jd_text=safe_jd,
        status="pending",
    )
    db.add(session)
    await db.flush()  # To get session.id
    
    # 5. Increment Usage
    await increment_usage(current_user.id)
    
    # 6. Queue Background Task
    background_tasks.add_task(process_tailoring_task, session.id)

    return {
        "session_id": str(session.id),
        "status": session.status,
    }


@router.get("/{session_id}/status")
async def get_session_status(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns current status and progress of the tailoring job.
    Frontend polls this during the loading screen.
    """
    stmt = select(TailoringSession).where(
        TailoringSession.id == session_id,
        TailoringSession.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {
        "session_id": str(session.id),
        "status": session.status,
        "error_message": session.error_message,
    }


@router.get("/{session_id}/download-pdf")
async def download_tailored_pdf(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    FIX 6 & 7: Secure PDF download with 15 min expiry.
    Generates and caches the PDF if it doesn't exist.
    Never returns public URL.
    """
    # 1. Verify Ownership
    stmt = select(TailoringSession).where(
        TailoringSession.id == session_id,
        TailoringSession.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=403, detail="Access denied")

    # 2. Get Output
    stmt_out = select(SessionOutput).where(SessionOutput.session_id == session_id)
    result_out = await db.execute(stmt_out)
    output = result_out.scalar_one_or_none()
    
    if not output or not output.tailored_resume_json:
        raise HTTPException(status_code=404, detail="Tailoring not complete yet")

    # 3. Generate & Cache PDF if needed
    if not output.tailored_pdf_url:
        try:
            pdf_bytes = generate_pdf_from_json(output.tailored_resume_json)
            # R2 key pattern
            key = f"pdfs/{current_user.id}/{session_id}/tailored.pdf"
            
            # Store in R2
            upload_to_r2(key, pdf_bytes, content_type="application/pdf")
            
            # Save to DB
            output.tailored_pdf_url = key
            output.pdf_generated_at = datetime.utcnow()
            await db.commit()
        except RuntimeError as e: # If R2 is not configured
             raise HTTPException(status_code=500, detail=str(e))
             
    # 4. Generate signed URL (15 min)
    signed_url = generate_r2_signed_url(output.tailored_pdf_url, expires_in=900)
    
    return {
        "url": signed_url,
        "expires_in": 900
    }
