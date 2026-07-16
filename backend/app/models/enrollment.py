from sqlalchemy import String, DateTime, Integer, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class EnrollmentStatus(str, enum.Enum):
    enrolled = "enrolled"
    completed = "completed"
    dropped = "dropped"


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_enrollment_user_course"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"), index=True)
    status: Mapped[EnrollmentStatus] = mapped_column(Enum(EnrollmentStatus), default=EnrollmentStatus.enrolled)
    enrolled_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    completed_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    progress_percent: Mapped[int] = mapped_column(Integer, default=0)
    last_lesson_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_module_id: Mapped[str | None] = mapped_column(String(100), nullable=True)


class LessonCompletion(Base):
    """Fine-grained record backing Enrollment.progress_percent — lets an
    admin see exactly which lessons a student finished, and makes progress
    recomputable/auditable instead of trusting a single mutable integer."""

    __tablename__ = "lesson_completions"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", "lesson_id", name="uq_lesson_completion"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"), index=True)
    module_id: Mapped[str] = mapped_column(String(100))
    lesson_id: Mapped[str] = mapped_column(String(100))
    completed_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
