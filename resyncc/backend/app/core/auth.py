"""
Authentication & authorization utilities.
Verifies Supabase JWTs and extracts user identity.
"""
from datetime import datetime, timezone
from uuid import UUID
from typing import Optional

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.models.tables import User

settings = get_settings()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Extracts and validates the JWT from the Authorization header.
    Returns the User ORM object if valid.
    Raises 401 if token is invalid/expired, 404 if user not found.
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user identifier from Supabase JWT
    sub: Optional[str] = payload.get("sub")
    if not sub:
        raise HTTPException(401, "Token missing subject claim")

    # Check expiry
    exp = payload.get("exp")
    if exp and datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(401, "Token expired")

    # Look up user by clerk_id (which stores Supabase auth.users.id)
    stmt = select(User).where(User.clerk_id == sub)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        # Auto-create user on first API call (Supabase manages auth)
        email = payload.get("email", "")
        user = User(
            clerk_id=sub,
            email=email,
            full_name=payload.get("user_metadata", {}).get("full_name", ""),
            plan="free",
        )
        db.add(user)
        await db.flush()

    return user


def require_plan(minimum_plan: str = "free"):
    """
    Dependency factory — raises 403 if user plan is insufficient.
    Plan hierarchy: free < pro < enterprise
    """
    plan_levels = {"free": 0, "pro": 1, "enterprise": 2}

    async def _check(user: User = Depends(get_current_user)):
        user_level = plan_levels.get(user.plan, 0)
        required_level = plan_levels.get(minimum_plan, 0)
        if user_level < required_level:
            raise HTTPException(
                403,
                f"This feature requires the '{minimum_plan}' plan. "
                f"Your current plan is '{user.plan}'."
            )
        return user

    return _check
