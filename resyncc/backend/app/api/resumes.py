from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.tables import User, Resume
from app.services.storage import generate_r2_signed_url
from app.services.ai import generate_base_resume_score

router = APIRouter()


@router.get("/{resume_id}/download")
async def download_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    FIX 6: Resume URL scoping.
    Downloads the original resume securely.
    Verifies user owns the resource, generates a signed R2 URL valid for 15 minutes.
    """
    # 1. Verify Ownership
    stmt = select(Resume).where(
        Resume.id == resume_id,
        Resume.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=403, detail="Access denied")

    if not resume.file_url:
        raise HTTPException(status_code=404, detail="Resume file not found")

    # 2. Generate signed URL (15 min expiry)
    try:
        signed_url = generate_r2_signed_url(
            resume.file_url,
            expires_in=900
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "url": signed_url,
        "expires_in": 900
    }

# ─────────────────────────────────────────────────────────────────────
# GET /{resume_id}/health_score  — Base Resume Score (PROMPT 6)
# ─────────────────────────────────────────────────────────────────────

@router.get("/{resume_id}/health_score", summary="Get base resume health score")
async def get_resume_health_score(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Scores the user's base resume independent of any job.
    Identifies structural weaknesses and provides actionable advice.
    """
    stmt = select(Resume).where(
        Resume.id == resume_id,
        Resume.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.raw_text:
        raise HTTPException(status_code=422, detail="Resume has no extracted text.")

    # In a real app we might cache this in the DB, e.g., resume.base_ats_score and a new column parsed_stats
    # For now, we compute on the fly or just use the AI service (Groq is fast).
    try:
        # Note: generate_base_resume_score was originally designed for JSON.
        # It's flexible enough to handle the raw text if wrapped correctly.
        score_data = await generate_base_resume_score({"raw_text": resume.raw_text})
        
        # Optionally update the DB with the overall score
        if "overall_score" in score_data and resume.base_ats_score == 0:
            resume.base_ats_score = score_data["overall_score"]
            await db.commit()
            
        return score_data
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Error generating health score: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate resume health score")
