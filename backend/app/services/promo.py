from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole

PYTHON_PROMO_CAP = 100

# Matches frontend/src/lib/pythonCourseTiers.ts — kept in sync manually,
# same tradeoff as the rest of the course/assessment reference-table sync
# in this codebase.
PYTHON_PROMO_COURSE_IDS = {"python-fundamentals", "python-intermediate"}


async def maybe_grant_python_promo(user: User, db: AsyncSession) -> None:
    """Called once, at account creation, for new student sign-ups only.
    Grants free access to the Python Beginner/Intermediate courses while
    fewer than PYTHON_PROMO_CAP grants have been made — a first-come,
    first-served promo, not retroactive to accounts created before this
    feature shipped (they simply were never counted)."""
    if user.role != UserRole.student:
        return

    granted_count = (await db.execute(
        select(func.count()).select_from(User).where(User.python_promo_granted.is_(True))
    )).scalar_one()

    if granted_count < PYTHON_PROMO_CAP:
        user.python_promo_granted = True


async def get_promo_status(db: AsyncSession) -> dict:
    granted_count = (await db.execute(
        select(func.count()).select_from(User).where(User.python_promo_granted.is_(True))
    )).scalar_one()
    return {
        "granted": granted_count,
        "cap": PYTHON_PROMO_CAP,
        "remaining": max(0, PYTHON_PROMO_CAP - granted_count),
    }
