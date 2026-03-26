from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api import health, resumes, sessions
from app.services.jobs import cleanup_stale_sessions_job

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start background workers (FIX 2: Session timeout worker)
    timeout_job = asyncio.create_task(cleanup_stale_sessions_job())
    
    yield
    
    # Shutdown: Cancel background workers
    timeout_job.cancel()
    try:
        await timeout_job
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title="ReSync AI Backend",
    description="API for ReSync AI resume tailoring platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS (only allow frontend origin in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "X-Sessions-Remaining",
        "X-Sessions-Limit",
        "X-Sessions-Reset",
        "Retry-After",
    ]
)

# Routers
app.include_router(health.router, prefix="/v1")
app.include_router(resumes.router, prefix="/v1/resumes", tags=["Resumes"])
app.include_router(sessions.router, prefix="/v1/sessions", tags=["Sessions"])
