"""
Subscription endpoints — Phase 3.1
Stripe checkout, webhook handler, and status.
"""
import logging
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.config import get_settings
from app.core.database import get_db
from app.models.tables import Subscription, User

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter()


# ─── Create Stripe checkout session ──────────────────────────────────

@router.post("/checkout", summary="Create a Stripe checkout session for Pro plan")
async def create_checkout_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Creates a Stripe Checkout session for upgrading to Pro.
    Returns the checkout URL to redirect the user.
    """
    if not settings.STRIPE_SECRET_KEY or settings.STRIPE_SECRET_KEY.startswith("sk_test_..."):
        raise HTTPException(
            503,
            "Payment system not configured. Please add STRIPE_SECRET_KEY to environment.",
        )

    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY

        checkout = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": settings.STRIPE_PRO_PRICE_ID, "quantity": 1}],
            success_url=f"{settings.FRONTEND_URL}/subscription?success=true&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/subscription?cancelled=true",
            customer_email=current_user.email,
            metadata={"user_id": str(current_user.id)},
        )

        return {
            "checkout_url": checkout.url,
            "session_id": checkout.id,
        }

    except Exception as e:
        logger.error(f"Stripe checkout creation failed for {current_user.id}: {e}")
        raise HTTPException(500, "Failed to create checkout session")


# ─── Stripe Webhook (no auth — Stripe calls this) ────────────────────

@router.post("/webhook", include_in_schema=False)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: AsyncSession = Depends(get_db),
):
    """
    Handles Stripe events to update user plan on subscription changes.
    Verifies webhook signature to prevent forgery.
    """
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(503, "Stripe webhook secret not configured")

    try:
        import stripe

        payload = await request.body()
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(400, "Invalid payload")
    except Exception:
        raise HTTPException(400, "Invalid signature")

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        await _handle_checkout_completed(data, db)
    elif event_type == "customer.subscription.deleted":
        await _handle_subscription_deleted(data, db)
    elif event_type == "invoice.payment_failed":
        await _handle_payment_failed(data, db)

    return {"received": True}


async def _handle_checkout_completed(data: dict, db: AsyncSession) -> None:
    """Upgrade user to Pro on successful checkout."""
    user_id = data.get("metadata", {}).get("user_id")
    if not user_id:
        logger.error("checkout.session.completed missing user_id in metadata")
        return

    from uuid import UUID
    stmt = select(User).where(User.id == UUID(user_id))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        logger.error(f"User {user_id} not found for checkout.session.completed")
        return

    user.plan = "pro"

    # Upsert subscription record
    sub_stmt = select(Subscription).where(Subscription.user_id == user.id)
    sub_result = await db.execute(sub_stmt)
    sub = sub_result.scalar_one_or_none()

    stripe_sub_id = data.get("subscription")
    stripe_customer_id = data.get("customer")

    if sub:
        sub.plan = "pro"
        sub.status = "active"
        sub.stripe_subscription_id = stripe_sub_id
        sub.stripe_customer_id = stripe_customer_id
    else:
        sub = Subscription(
            user_id=user.id,
            stripe_customer_id=stripe_customer_id,
            stripe_subscription_id=stripe_sub_id,
            plan="pro",
            status="active",
        )
        db.add(sub)

    await db.commit()
    logger.info(f"User {user_id} upgraded to Pro")


async def _handle_subscription_deleted(data: dict, db: AsyncSession) -> None:
    """Downgrade user to free when subscription is cancelled."""
    stripe_sub_id = data.get("id")
    stmt = select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
    result = await db.execute(stmt)
    sub = result.scalar_one_or_none()
    if not sub:
        return

    sub.plan = "free"
    sub.status = "canceled"

    # Also downgrade the user record
    user_stmt = select(User).where(User.id == sub.user_id)
    user_result = await db.execute(user_stmt)
    user = user_result.scalar_one_or_none()
    if user:
        user.plan = "free"

    await db.commit()
    logger.info(f"Subscription {stripe_sub_id} cancelled — user downgraded to free")


async def _handle_payment_failed(data: dict, db: AsyncSession) -> None:
    """Mark subscription as past_due when payment fails."""
    stripe_sub_id = data.get("subscription")
    if not stripe_sub_id:
        return

    stmt = select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
    result = await db.execute(stmt)
    sub = result.scalar_one_or_none()
    if sub:
        sub.status = "past_due"
        await db.commit()


# ─── Get subscription status ──────────────────────────────────────────

@router.get("/status", summary="Get user's current subscription plan")
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Subscription).where(Subscription.user_id == current_user.id)
    result = await db.execute(stmt)
    sub = result.scalar_one_or_none()

    return {
        "user_id": str(current_user.id),
        "plan": current_user.plan,
        "subscription": {
            "status": sub.status if sub else "none",
            "current_period_end": (
                sub.current_period_end.isoformat() if sub and sub.current_period_end else None
            ),
        } if sub else None,
    }


@router.delete("/cancel", summary="Cancel Pro subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cancel the active subscription at period end (not immediate)."""
    if not settings.STRIPE_SECRET_KEY or settings.STRIPE_SECRET_KEY.startswith("sk_"):
        stmt = select(Subscription).where(Subscription.user_id == current_user.id)
        result = await db.execute(stmt)
        sub = result.scalar_one_or_none()
        if sub and sub.stripe_subscription_id:
            try:
                import stripe
                stripe.api_key = settings.STRIPE_SECRET_KEY
                stripe.Subscription.modify(
                    sub.stripe_subscription_id,
                    cancel_at_period_end=True,
                )
                return {"cancelled": True, "message": "Subscription will end at period end"}
            except Exception as e:
                raise HTTPException(500, f"Failed to cancel: {e}")

    raise HTTPException(404, "No active subscription found")
