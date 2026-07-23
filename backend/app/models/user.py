from sqlalchemy import String, Enum, DateTime, Date, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class UserRole(str, enum.Enum):
    student = "student"
    lecturer = "lecturer"
    admin = "admin"
    company = "company"
    parent = "parent"


class Plan(str, enum.Enum):
    free = "free"
    pro = "pro"
    team = "team"


class PlanSource(str, enum.Enum):
    none = "none"
    paid = "paid"
    admin_granted = "admin_granted"


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    non_binary = "non_binary"
    prefer_not_to_say = "prefer_not_to_say"


class RaceCategory(str, enum.Enum):
    """South African B-BBEE / Employment Equity reporting categories.

    Optional, self-reported, POPIA special personal information — must
    default to NULL and never be pre-selected in any form.
    """
    african = "african"
    coloured = "coloured"
    indian = "indian"
    white = "white"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    firebase_uid: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.student)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Access control — added for the admin panel / AI Tutor trial gate
    plan: Mapped[Plan] = mapped_column(Enum(Plan), default=Plan.free)
    plan_source: Mapped[PlanSource] = mapped_column(Enum(PlanSource), default=PlanSource.none)
    tutor_uses_count: Mapped[int] = mapped_column(Integer, default=0)
    tutor_unlocked: Mapped[bool] = mapped_column(Boolean, default=False)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)
    last_login_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    plan_expires_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)

    # "First 100 sign-ups learn Python free" promo — granted once, at account
    # creation, to the first 100 students (see services/promo.py). Not tied
    # to plan/plan_source since it's a scoped course-access grant, not a
    # billing tier.
    python_promo_granted: Mapped[bool] = mapped_column(Boolean, default=False)

    # Profile — all optional, self-reported, filled in later via the
    # student's own Profile page (never collected at registration).
    first_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    date_of_birth: Mapped[Date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[Gender | None] = mapped_column(Enum(Gender), nullable=True)
    job_title: Mapped[str | None] = mapped_column(String(150), nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(100), nullable=True)
    race: Mapped[RaceCategory | None] = mapped_column(Enum(RaceCategory), nullable=True)

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
