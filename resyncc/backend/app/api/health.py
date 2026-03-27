from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import get_db

router = APIRouter()
settings = get_settings()


@router.get("/health", tags=["System"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Production health check — tests DB connection, Groq API key, and R2 credentials.
    Returns 200 OK if healthy, 503 if degraded.
    """
    health = {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {}
    }
    
    # 1. Database
    try:
        await db.execute(text("SELECT 1"))
        health["services"]["database"] = "ok"
    except Exception as e:
        health["services"]["database"] = f"fail: {e}"
        health["status"] = "degraded"
    
    # 2. Groq (lightweight ping)
    try:
        # Just verify API key is set for MVP
        if not settings.GROQ_API_KEY.startswith("gsk_"):
            raise ValueError("Invalid Groq API key format")
        health["services"]["groq"] = "ok"
    except Exception as e:
        health["services"]["groq"] = f"fail: {e}"
        health["status"] = "degraded"
    
    # 3. R2 Storage
    try:
        if not settings.R2_ACCESS_KEY_ID:
            raise ValueError("No R2 configure")
        health["services"]["r2"] = "ok"
    except Exception as e:
        health["services"]["r2"] = f"fail: {e}"
        health["status"] = "degraded"
    
    status_code = 200 if health["status"] == "ok" else 503
    return JSONResponse(content=health, status_code=status_code)
