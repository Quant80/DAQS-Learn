from sqlalchemy import String, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base


class Certificate(Base):
    """Server-issued, verifiable certificate. Fields ending in _snapshot are
    frozen at issue time — course titles or student names can change later,
    the certificate shouldn't."""

    __tablename__ = "certificates"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_certificate_user_course"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    verification_code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"))
    enrollment_id: Mapped[int | None] = mapped_column(ForeignKey("enrollments.id"), nullable=True)
    course_name_snapshot: Mapped[str] = mapped_column(String(255))
    course_track_snapshot: Mapped[str] = mapped_column(String(100))
    difficulty_snapshot: Mapped[str] = mapped_column(String(50))
    student_name_snapshot: Mapped[str] = mapped_column(String(255))
    issued_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    revoked_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    revoked_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)
