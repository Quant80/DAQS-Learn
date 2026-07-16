from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User
from app.models.certificate import Certificate
from app.services.auth_service import get_current_user

router = APIRouter()


class CertificateResponse(BaseModel):
    id: int
    verification_code: str
    course_id: str
    course_name: str
    course_track: str
    difficulty: str
    student_name: str
    issued_at: datetime
    revoked: bool

    class Config:
        from_attributes = True


def _to_response(c: Certificate) -> CertificateResponse:
    return CertificateResponse(
        id=c.id,
        verification_code=c.verification_code,
        course_id=c.course_id,
        course_name=c.course_name_snapshot,
        course_track=c.course_track_snapshot,
        difficulty=c.difficulty_snapshot,
        student_name=c.student_name_snapshot,
        issued_at=c.issued_at,
        revoked=c.revoked,
    )


@router.get("/mine", response_model=list[CertificateResponse])
async def my_certificates(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Certificate).where(Certificate.user_id == current_user.id).order_by(Certificate.issued_at.desc())
    )
    return [_to_response(c) for c in result.scalars().all()]


class VerifyResponse(BaseModel):
    valid: bool
    revoked: bool = False
    course_name: str | None = None
    difficulty: str | None = None
    student_name: str | None = None
    issued_at: datetime | None = None


@router.get("/verify/{code}", response_model=VerifyResponse)
async def verify_certificate(code: str, db: AsyncSession = Depends(get_db)):
    """Public, no auth — the verification code itself is the lookup key.
    Deliberately excludes email/internal IDs — minimal disclosure for an
    unauthenticated endpoint."""
    result = await db.execute(select(Certificate).where(Certificate.verification_code == code))
    cert = result.scalar_one_or_none()
    if cert is None:
        return VerifyResponse(valid=False)
    return VerifyResponse(
        valid=not cert.revoked,
        revoked=cert.revoked,
        course_name=cert.course_name_snapshot,
        difficulty=cert.difficulty_snapshot,
        student_name=cert.student_name_snapshot,
        issued_at=cert.issued_at,
    )
