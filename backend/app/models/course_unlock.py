from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base


class CourseUnlock(Base):
    """Admin-granted access to one specific course for one specific
    student — narrower than a Pro plan grant, which unlocks everything."""

    __tablename__ = "course_unlocks"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_course_unlock_user_course"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"), index=True)
    granted_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    granted_by_admin_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    # NULL = permanent unlock. Set for a time-limited (e.g. promotional) grant.
    expires_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
