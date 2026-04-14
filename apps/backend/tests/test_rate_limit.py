import os
from uuid import uuid4

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost:5432/resync")
os.environ.setdefault("JWT_SECRET", "x" * 32)
os.environ.setdefault("GROQ_API_KEY", "gsk_test")

from app.core.rate_limit import _get_limit_for_plan, increment_usage, check_rate_limit


async def test_free_plan_limit_math() -> None:
    assert _get_limit_for_plan("free") >= 1


async def test_increment_and_check_do_not_crash() -> None:
    user_id = uuid4()
    await increment_usage(user_id)
    info = await check_rate_limit(user_id, "free")
    assert "remaining" in info
    assert "limit" in info
