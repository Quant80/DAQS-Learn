from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Plan
from app.models.course import Course
from app.models.course_unlock import CourseUnlock
from app.services.promo import PYTHON_PROMO_COURSE_IDS


async def get_unlocked_course_ids(user_id: int, db: AsyncSession) -> set[str]:
    """Union of this student's personal unlocks and any course currently
    unlocked for everyone — both expire on their own schedule, so an
    already-lapsed grant simply stops counting without needing cleanup."""
    now = datetime.utcnow()

    personal = await db.execute(
        select(CourseUnlock.course_id).where(
            CourseUnlock.user_id == user_id,
            (CourseUnlock.expires_at.is_(None)) | (CourseUnlock.expires_at > now),
        )
    )
    global_unlocks = await db.execute(
        select(Course.id).where(Course.globally_unlocked_until.is_not(None), Course.globally_unlocked_until > now)
    )
    return set(personal.scalars().all()) | set(global_unlocks.scalars().all())


def can_access_course(course_id: str, user: User, unlocked_course_ids: set[str]) -> bool:
    """Access model: an admin-granted unlock (personal or global) always
    wins. Python Beginner/Intermediate are free for the first 100
    sign-ups or with Pro/Team. Every other course requires Pro/Team —
    there is no other free tier."""
    if course_id in unlocked_course_ids:
        return True
    if course_id in PYTHON_PROMO_COURSE_IDS:
        return user.plan != Plan.free or user.python_promo_granted
    return user.plan != Plan.free
