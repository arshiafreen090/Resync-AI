import asyncio
import logging
from datetime import datetime, timezone, timedelta

from sqlalchemy import update

from app.core.config import get_settings
from app.core.database import async_session
from app.models.tables import TailoringSession

logger = logging.getLogger(__name__)
settings = get_settings()


async def cleanup_stale_sessions_job() -> None:
    """
    Background worker that runs every 60 seconds.
    Sets 'timed_out' for sessions stuck in 'analyzing' or 'reviewing'
    longer than SESSION_TIMEOUT_MINUTES.
    """
    timeout_duration = timedelta(minutes=settings.SESSION_TIMEOUT_MINUTES)
    
    while True:
        try:
            cutoff = datetime.now(timezone.utc) - timeout_duration
            
            async with async_session() as db:
                stmt = (
                    update(TailoringSession)
                    .where(
                        TailoringSession.status.in_(["analyzing", "reviewing"]),
                        TailoringSession.started_at < cutoff,
                    )
                    .values(status="timed_out")
                )
                
                result = await db.execute(stmt)
                await db.commit()
                
                if result.rowcount > 0:
                    logger.info(f"Timed out {result.rowcount} stale tailoring sessions.")
        
        except asyncio.CancelledError:
            logger.info("Session cleanup job cancelled.")
            break
        except Exception as e:
            logger.error(f"Error in session cleanup job: {e}")
            
        await asyncio.sleep(60)
