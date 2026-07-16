from sqlalchemy import DateTime, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base


class AssessmentAttempt(Base):
    """A completed (or in-progress) attempt at an assessment. percentage and
    passed are always server-computed from `answers` — never trust a
    client-sent score."""

    __tablename__ = "assessment_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    template_id: Mapped[str] = mapped_column(ForeignKey("assessment_templates.id"), index=True)
    started_at: Mapped[DateTime] = mapped_column(DateTime)
    completed_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    total_score: Mapped[int] = mapped_column(Integer, default=0)
    max_score: Mapped[int] = mapped_column(Integer, default=0)
    percentage: Mapped[int] = mapped_column(Integer, default=0)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    answers: Mapped[list] = mapped_column(JSONB, default=list)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
