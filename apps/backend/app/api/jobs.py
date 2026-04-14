"""
Job Hunt endpoints — Phase 2.1
Handles n8n webhook triggering and job result storage/retrieval.
"""
import logging
from uuid import UUID

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.config import get_settings
from app.core.database import get_db
from app.models.tables import JobHunt, JobResult, Resume, User

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter()


# ─── Schemas ─────────────────────────────────────────────────────────

class HuntRequest(BaseModel):
    resume_id: UUID
    keywords: str = Field(default="software engineer intern")
    location: str = Field(default="India")
    experience_level: str = Field(default="1,2")
    work_type: str = Field(default="2")
    min_match_score: int = Field(default=70, ge=0, le=100)


class JobStoreRequest(BaseModel):
    """Schema for n8n callback to store job results."""
    user_id: str
    hunt_id: str
    jobs: list[dict]


# ─── Trigger job hunt ─────────────────────────────────────────────────

@router.post("/hunt", summary="Start a Job Hunt via n8n")
async def start_job_hunt(
    request: HuntRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    1. Verify resume ownership and get raw text
    2. Create JobHunt record (pending)
    3. Fire-and-forget POST to n8n webhook
    4. Return hunt_id for polling
    """
    # Verify resume
    stmt = select(Resume).where(
        and_(Resume.id == request.resume_id, Resume.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(404, "Resume not found")
    if not resume.raw_text:
        raise HTTPException(422, "Resume has no extracted text. Re-upload via /v1/upload/resume.")

    hunt = JobHunt(
        user_id=current_user.id,
        resume_id=request.resume_id,
        filters_json={
            "keywords": request.keywords,
            "location": request.location,
            "experience_level": request.experience_level,
            "work_type": request.work_type,
            "min_match_score": request.min_match_score,
        },
        status="pending",
    )
    db.add(hunt)
    await db.flush()

    hunt_id = str(hunt.id)

    # Fire n8n webhook in background
    background_tasks.add_task(
        _trigger_n8n_webhook,
        hunt_id=hunt_id,
        user_id=str(current_user.id),
        resume_text=resume.raw_text,
        filters=hunt.filters_json,
    )

    return {
        "hunt_id": hunt_id,
        "status": "pending",
        "message": "Job hunt started. Poll /v1/jobs/hunt/{hunt_id} for results.",
    }


async def _trigger_n8n_webhook(
    hunt_id: str,
    user_id: str,
    resume_text: str,
    filters: dict,
) -> None:
    """Sends the hunt payload to the n8n webhook. Best-effort."""
    if not settings.N8N_WEBHOOK_URL:
        logger.warning("N8N_WEBHOOK_URL not configured — skipping job hunt trigger")
        return

    payload = {
        "user_id": user_id,
        "hunt_id": hunt_id,
        "resume_text": resume_text[:8000],  # Trim for API safety
        "filters": filters,
    }
    headers = {}
    if settings.N8N_INTERNAL_KEY:
        headers["X-Internal-Key"] = settings.N8N_INTERNAL_KEY

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(settings.N8N_WEBHOOK_URL, json=payload, headers=headers)
            resp.raise_for_status()
            logger.info(f"n8n webhook triggered for hunt {hunt_id}: {resp.status_code}")
    except Exception as e:
        logger.error(f"n8n webhook failed for hunt {hunt_id}: {e}")


# ─── Poll hunt status ─────────────────────────────────────────────────

@router.get("/hunt/{hunt_id}", summary="Poll job hunt status and results")
async def get_hunt_status(
    hunt_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(JobHunt).where(
        and_(JobHunt.id == hunt_id, JobHunt.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    hunt = result.scalar_one_or_none()
    if not hunt:
        raise HTTPException(404, "Job hunt not found")

    # Load results
    res_stmt = (
        select(JobResult)
        .where(JobResult.hunt_id == hunt_id)
        .order_by(JobResult.match_percent.desc())
    )
    res_result = await db.execute(res_stmt)
    jobs = res_result.scalars().all()

    return {
        "hunt_id": str(hunt.id),
        "status": hunt.status,
        "jobs": [
            {
                "id": str(j.id),
                "title": j.title,
                "company": j.company,
                "location": j.location,
                "work_type": j.work_type,
                "experience_level": j.experience_level,
                "match_percent": j.match_percent,
                "match_reasoning": j.match_reasoning,
                "apply_url": j.apply_url,
                "source": j.source,
            }
            for j in jobs
        ],
    }


# ─── Internal: n8n callback to store results ─────────────────────────

@router.post("/internal/store", include_in_schema=False)
async def store_job_results(
    body: JobStoreRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Internal endpoint called by n8n after job hunt completes.
    Not exposed in public API docs. Protected by X-Internal-Key header
    which is validated in middleware (to be added) or checked here.
    """
    hunt_id = UUID(body.hunt_id)

    # Update hunt status
    hunt_stmt = select(JobHunt).where(JobHunt.id == hunt_id)
    hunt_result = await db.execute(hunt_stmt)
    hunt = hunt_result.scalar_one_or_none()
    if not hunt:
        raise HTTPException(404, "Hunt not found")

    hunt.status = "complete"

    # Store each job result
    for job in body.jobs:
        jr = JobResult(
            hunt_id=hunt_id,
            title=job.get("title", "Unknown"),
            company=job.get("company", "Unknown"),
            location=job.get("location"),
            work_type=job.get("work_type"),
            experience_level=job.get("experience_level"),
            match_percent=job.get("match_percent"),
            match_reasoning=job.get("match_reasoning"),
            apply_url=job.get("apply_url"),
            source=job.get("source", "linkedin"),
        )
        db.add(jr)

    await db.commit()
    return {"stored": len(body.jobs)}
