from pydantic import BaseModel, EmailStr
from datetime import datetime, date


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    avatar_url: str | None
    is_verified: bool
    created_at: datetime

    # Access control — used by the frontend to sync plan/lock/quota state
    plan: str
    plan_source: str
    plan_expires_at: datetime | None
    tutor_uses_count: int
    tutor_unlocked: bool
    is_locked: bool
    last_login_at: datetime | None
    python_promo_granted: bool
    # Admin-granted per-course/global unlocks — not a User column, filled
    # in by the endpoint after loading from course_access.get_unlocked_course_ids.
    unlocked_course_ids: list[str] = []

    # Profile — all optional, self-reported
    first_name: str | None
    last_name: str | None
    date_of_birth: date | None
    gender: str | None
    job_title: str | None
    nationality: str | None
    race: str | None

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    job_title: str | None = None
    nationality: str | None = None
    race: str | None = None
