from sqlalchemy import String, DateTime, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base


class Course(Base):
    """Lightweight reference/cache of the frontend's static course catalog
    (frontend/src/data/courses.ts), kept in sync via POST /admin/catalog/sync.
    Enrollment/LessonCompletion/Certificate rows FK against this table's id
    (the same string slug the frontend already uses)."""

    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    track: Mapped[str] = mapped_column(String(100))
    difficulty: Mapped[str] = mapped_column(String(50))
    estimated_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_lessons: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Admin override — unlocks this course for every student regardless of
    # plan/promo, until this timestamp (NULL = not globally unlocked).
    # Time-limited so a promotional unlock doesn't have to be remembered
    # and manually turned back off. Never touched by the catalog sync (see
    # admin.py), so it survives re-syncing the reference table.
    globally_unlocked_until: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)

    synced_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
