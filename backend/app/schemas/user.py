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

    class Config:
        from_attributes = True
