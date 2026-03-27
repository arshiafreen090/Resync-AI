from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.tables import User, Resume
from app.services.storage import generate_r2_signed_url

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
