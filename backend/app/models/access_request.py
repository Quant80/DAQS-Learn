from sqlalchemy import String, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class AccessRequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    denied = "denied"


class AccessRequest(Base):
    """A student's request to unlock AI Tutor access after hitting the free quota."""

    __tablename__ = "access_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    status: Mapped[AccessRequestStatus] = mapped_column(
        Enum(AccessRequestStatus), default=AccessRequestStatus.pending
    )
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    resolved_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    resolved_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
