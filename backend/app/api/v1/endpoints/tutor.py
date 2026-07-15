import secrets
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User
from app.models.access_request import AccessRequest, AccessRequestStatus
from app.services.auth_service import get_current_user
from app.services.quota import check_and_consume_quota

router = APIRouter()


class QuotaResponse(BaseModel):
    allowed: bool
    remaining: int | None
    plan: str
    is_locked: bool


class RequestAccessUser(BaseModel):
    email: str
    full_name: str


class RequestAccessResponse(BaseModel):
    token: str
    user: RequestAccessUser


@router.post("/check-quota", response_model=QuotaResponse)
async def check_quota(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await check_and_consume_quota(current_user, db)
    return QuotaResponse(**result)


@router.post("/request-access", response_model=RequestAccessResponse)
async def request_access(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Reuse an existing pending request instead of spamming a new email/token
    # every time the student clicks the button again.
    result = await db.execute(
        select(AccessRequest).where(
            AccessRequest.user_id == current_user.id,
            AccessRequest.status == AccessRequestStatus.pending,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        return RequestAccessResponse(
            token=existing.token,
            user=RequestAccessUser(email=current_user.email, full_name=current_user.full_name),
        )

    req = AccessRequest(user_id=current_user.id, token=secrets.token_urlsafe(32))
    db.add(req)
    await db.commit()

    return RequestAccessResponse(
        token=req.token,
        user=RequestAccessUser(email=current_user.email, full_name=current_user.full_name),
    )
