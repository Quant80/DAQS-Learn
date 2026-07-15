from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User, Plan, PlanSource
from app.models.access_request import AccessRequest, AccessRequestStatus
from app.services.auth_service import get_current_admin

router = APIRouter()


# ── Users ──────────────────────────────────────────────────────────────────

class AdminUserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    plan: str
    plan_source: str
    tutor_uses_count: int
    tutor_unlocked: bool
    is_locked: bool
    last_login_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/users", response_model=list[AdminUserResponse])
async def list_users(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()


async def _get_user_or_404(user_id: int, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/users/{user_id}/lock", response_model=AdminUserResponse)
async def lock_user(user_id: int, admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = await _get_user_or_404(user_id, db)
    user.is_locked = True
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/unlock", response_model=AdminUserResponse)
async def unlock_user(user_id: int, admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = await _get_user_or_404(user_id, db)
    user.is_locked = False
    await db.commit()
    await db.refresh(user)
    return user


class SetPlanRequest(BaseModel):
    plan: Plan


@router.post("/users/{user_id}/plan", response_model=AdminUserResponse)
async def set_plan(
    user_id: int,
    body: SetPlanRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user_or_404(user_id, db)
    user.plan = body.plan
    user.plan_source = PlanSource.admin_granted
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/reset-quota", response_model=AdminUserResponse)
async def reset_quota(user_id: int, admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = await _get_user_or_404(user_id, db)
    user.tutor_uses_count = 0
    user.tutor_unlocked = False
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/unlock-tutor", response_model=AdminUserResponse)
async def unlock_tutor(user_id: int, admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = await _get_user_or_404(user_id, db)
    user.tutor_unlocked = True
    await db.commit()
    await db.refresh(user)
    return user


# ── Access requests ──────────────────────────────────────────────────────

class AdminAccessRequestResponse(BaseModel):
    id: int
    status: str
    created_at: datetime
    resolved_at: datetime | None
    user_id: int
    user_email: str
    user_full_name: str


@router.get("/requests", response_model=list[AdminAccessRequestResponse])
async def list_requests(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AccessRequest, User)
        .join(User, User.id == AccessRequest.user_id)
        .order_by(AccessRequest.created_at.desc())
    )
    return [
        AdminAccessRequestResponse(
            id=req.id,
            status=req.status.value,
            created_at=req.created_at,
            resolved_at=req.resolved_at,
            user_id=user.id,
            user_email=user.email,
            user_full_name=user.full_name,
        )
        for req, user in result.all()
    ]


async def _resolve_request(request_id: int, approve: bool, admin: User, db: AsyncSession) -> AccessRequest:
    result = await db.execute(select(AccessRequest).where(AccessRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != AccessRequestStatus.pending:
        return req

    req.status = AccessRequestStatus.approved if approve else AccessRequestStatus.denied
    req.resolved_at = datetime.utcnow()
    req.resolved_by_id = admin.id

    if approve:
        user = await _get_user_or_404(req.user_id, db)
        user.tutor_unlocked = True

    await db.commit()
    await db.refresh(req)
    return req


@router.post("/requests/{request_id}/approve", response_model=AdminAccessRequestResponse)
async def approve_request(
    request_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    req = await _resolve_request(request_id, True, admin, db)
    result = await db.execute(select(User).where(User.id == req.user_id))
    user = result.scalar_one()
    return AdminAccessRequestResponse(
        id=req.id, status=req.status.value, created_at=req.created_at, resolved_at=req.resolved_at,
        user_id=user.id, user_email=user.email, user_full_name=user.full_name,
    )


@router.post("/requests/{request_id}/deny", response_model=AdminAccessRequestResponse)
async def deny_request(
    request_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    req = await _resolve_request(request_id, False, admin, db)
    result = await db.execute(select(User).where(User.id == req.user_id))
    user = result.scalar_one()
    return AdminAccessRequestResponse(
        id=req.id, status=req.status.value, created_at=req.created_at, resolved_at=req.resolved_at,
        user_id=user.id, user_email=user.email, user_full_name=user.full_name,
    )


@router.get("/requests/approve-by-token", response_class=HTMLResponse)
async def approve_by_token(token: str, db: AsyncSession = Depends(get_db)):
    """The link clicked from the notification email — no admin session
    required, the unguessable token itself is the authorization."""
    result = await db.execute(select(AccessRequest).where(AccessRequest.token == token))
    req = result.scalar_one_or_none()

    if not req:
        return HTMLResponse("<h2>Invalid or expired link.</h2>", status_code=404)

    if req.status == AccessRequestStatus.pending:
        req.status = AccessRequestStatus.approved
        req.resolved_at = datetime.utcnow()
        user = await _get_user_or_404(req.user_id, db)
        user.tutor_unlocked = True
        await db.commit()
        return HTMLResponse(f"<h2>Approved — {user.full_name} ({user.email}) now has unlocked AI Tutor access.</h2>")

    return HTMLResponse(f"<h2>This request was already {req.status.value}.</h2>")
