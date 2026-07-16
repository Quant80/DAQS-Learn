from sqlalchemy import String, DateTime, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base


class AssessmentTemplate(Base):
    """Lightweight reference/cache of the frontend's static assessment
    catalog (frontend/src/data/assessmentTemplates.ts), kept in sync via
    POST /admin/catalog/sync. AssessmentAttempt rows FK against this table's
    id (the same string slug the frontend already uses)."""

    __tablename__ = "assessment_templates"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    subject: Mapped[str] = mapped_column(String(100))
    difficulty: Mapped[str] = mapped_column(String(50))
    question_count: Mapped[int] = mapped_column(Integer, default=0)
    time_limit_minutes: Mapped[int] = mapped_column(Integer, default=0)
    pass_mark_percent: Mapped[int] = mapped_column(Integer, default=50)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    synced_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
