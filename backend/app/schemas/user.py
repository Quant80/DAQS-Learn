from pydantic import BaseModel, EmailStr
from datetime import datetime


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
    tutor_uses_count: int
    tutor_unlocked: bool
    is_locked: bool
    last_login_at: datetime | None

    class Config:
        from_attributes = True
