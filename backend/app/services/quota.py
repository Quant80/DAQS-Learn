from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Plan

FREE_TUTOR_LIMIT = 2


async def check_and_consume_quota(user: User, db: AsyncSession) -> dict:
    """Called once per AI Tutor question. Increments the free-tier counter
    only when it actually applies — paying plans and admin-unlocked accounts
    are never touched. Locking is enforced earlier, in get_current_user, so
    a locked account never reaches this function at all."""
    if user.plan != Plan.free or user.tutor_unlocked:
        return {"allowed": True, "remaining": None, "plan": user.plan.value, "is_locked": False}

    if user.tutor_uses_count >= FREE_TUTOR_LIMIT:
        return {"allowed": False, "remaining": 0, "plan": user.plan.value, "is_locked": False}

    user.tutor_uses_count += 1
    await db.commit()
    return {
        "allowed": True,
        "remaining": FREE_TUTOR_LIMIT - user.tutor_uses_count,
        "plan": user.plan.value,
        "is_locked": False,
    }
