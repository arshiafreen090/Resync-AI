"""
Server-side rate limiting — never trust the frontend for plan enforcement.

Uses in-memory counter for MVP (upgrade to Redis later).
Counter resets at midnight UTC daily.
"""
import asyncio
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from uuid import UUID

from fastapi import HTTPException

from app.core.config import get_settings

settings = get_settings()

# In-memory store: { user_id: { "count": N, "reset_at": datetime } }
_rate_store: dict[UUID, dict] = defaultdict(
    lambda: {"count": 0, "reset_at": _next_midnight_utc()}
)
_lock = asyncio.Lock()


def _next_midnight_utc() -> datetime:
    """Returns the next midnight UTC."""
    now = datetime.now(timezone.utc)
    tomorrow = now.date() + timedelta(days=1)
    return datetime(
        tomorrow.year, tomorrow.month, tomorrow.day,
        tzinfo=timezone.utc
    )


def _get_limit_for_plan(plan: str) -> int:
    """Returns session limit based on plan."""
    if plan == "pro":
        return settings.PRO_TIER_SESSION_LIMIT
    if plan == "enterprise":
        return 999999  # effectively unlimited
    return settings.FREE_TIER_SESSION_LIMIT


async def check_rate_limit(user_id: UUID, plan: str) -> dict:
    """
    Check if user is within their daily session limit.
    Returns remaining count info.
    Raises HTTP 429 if limit exceeded.
    """
    limit = _get_limit_for_plan(plan)

    async with _lock:
        entry = _rate_store[user_id]
        now = datetime.now(timezone.utc)

        # Reset if past midnight
        if now >= entry["reset_at"]:
            entry["count"] = 0
            entry["reset_at"] = _next_midnight_utc()

        remaining = limit - entry["count"]
        reset_at = entry["reset_at"]

    if remaining <= 0:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Daily limit reached ({limit} sessions/day on '{plan}' plan). "
                "Upgrade to Pro for more sessions."
            ),
            headers={
                "X-Sessions-Remaining": "0",
                "X-Sessions-Limit": str(limit),
                "X-Sessions-Reset": reset_at.isoformat(),
                "Retry-After": str(int((reset_at - now).total_seconds())),
            },
        )

    return {
        "remaining": remaining,
        "limit": limit,
        "reset_at": reset_at,
    }


async def increment_usage(user_id: UUID) -> None:
    """Increment the session count for a user after successful creation."""
    async with _lock:
        _rate_store[user_id]["count"] += 1


def get_rate_headers(info: dict) -> dict[str, str]:
    """Generate rate limit response headers."""
    return {
        "X-Sessions-Remaining": str(info["remaining"] - 1),  # after this one
        "X-Sessions-Limit": str(info["limit"]),
        "X-Sessions-Reset": info["reset_at"].isoformat(),
    }
