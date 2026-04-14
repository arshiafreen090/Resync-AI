"""
Resume upload endpoint.
Handles multipart file upload → text extraction → R2 storage → DB record.

Flow:
  1. Receive multipart file (PDF or DOCX)
  2. Validate size / type
  3. Extract raw text via parser service
  4. Upload raw file to R2 (temporary bucket)
  5. Create/update Resume row in DB with raw_text + file_url + parsed status
  6. Return { resume_id, name, char_count }
"""
import logging
import uuid as _uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.tables import Resume, User
from app.services.parser import extract_text
from app.services.storage import upload_to_r2

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/resume", summary="Upload & parse a resume file")
async def upload_resume(
    file: UploadFile = File(..., description="Resume file — PDF or DOCX, max 5 MB"),
    name: str = Form(
        default="",
        description="Optional display name for this resume (e.g. 'Google Intern Resume')",
    ),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a resume and automatically extract its text content.

    Returns the new Resume record's ID so downstream endpoints
    (e.g. /v1/sessions/analyze) can reference it by ID without
    re-uploading the file.
    """

    # ── 1. Read file into memory ───────────────────────────────────────────
    file_bytes = await file.read()
    content_type = file.content_type or ""
    original_filename = file.filename or "resume"

    logger.info(
        f"upload_resume: user={current_user.id} "
        f"filename={original_filename} size={len(file_bytes)} "
        f"content_type={content_type}"
    )

    # ── 2. Extract text (validates size + format internally) ───────────────
    try:
        raw_text = extract_text(
            file_bytes,
            content_type=content_type,
            filename=original_filename,
        )
    except ValueError as e:
        # Bad format or oversized → 422
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        # Extraction failure → 500
        logger.error(f"Text extraction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    if not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail=(
                "Could not extract any text from the uploaded file. "
                "Please ensure the document is not encrypted or image-only."
            ),
        )

    # ── 3. Upload raw file to R2 ───────────────────────────────────────────
    file_key: str | None = None
    try:
        file_key = f"resumes/{current_user.id}/{_uuid.uuid4()}/{original_filename}"
        upload_to_r2(
            key=file_key,
            data=file_bytes,
            content_type=content_type or "application/octet-stream",
        )
        logger.info(f"Uploaded to R2: {file_key}")
    except RuntimeError:
        # R2 not configured locally — still save to DB without file_url
        logger.warning("R2 not configured — skipping file upload, saving text only.")
        file_key = None

    # ── 4. Persist Resume record ───────────────────────────────────────────
    display_name = name.strip() or original_filename
    resume = Resume(
        user_id=current_user.id,
        name=display_name,
        file_url=file_key,                  # R2 object key (or None)
        raw_text=raw_text,                  # Full extracted text — used by AI
        parsed_json={},                     # Structured JSON populated later by AI
        base_ats_score=0,
    )
    db.add(resume)
    await db.flush()  # Assigns resume.id before commit

    logger.info(
        f"Resume saved: id={resume.id} "
        f"chars={len(raw_text)} user={current_user.id}"
    )

    return {
        "resume_id": str(resume.id),
        "name": display_name,
        "char_count": len(raw_text),
        "file_stored": file_key is not None,
        "preview": raw_text[:300] + ("..." if len(raw_text) > 300 else ""),
    }


@router.get("/resumes", summary="List user's uploaded resumes")
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns all resume records belonging to the current user.
    Lightweight — does not return raw_text or parsed_json to keep response small.
    """
    from sqlalchemy import select

    stmt = (
        select(
            Resume.id,
            Resume.name,
            Resume.base_ats_score,
            Resume.created_at,
            Resume.updated_at,
        )
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
    )
    result = await db.execute(stmt)
    rows = result.all()

    return {
        "resumes": [
            {
                "resume_id": str(row.id),
                "name": row.name,
                "base_ats_score": row.base_ats_score,
                "created_at": row.created_at.isoformat() if row.created_at else None,
                "updated_at": row.updated_at.isoformat() if row.updated_at else None,
            }
            for row in rows
        ]
    }
