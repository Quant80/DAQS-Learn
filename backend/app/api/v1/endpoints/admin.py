from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User, Plan, PlanSource
from app.models.access_request import AccessRequest, AccessRequestStatus
from app.models.course import Course
from app.models.assessment_template import AssessmentTemplate
from app.models.enrollment import Enrollment
from app.models.assessment_attempt import AssessmentAttempt
from app.models.certificate import Certificate
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
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot lock your own account")
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


# ── Catalog sync ─────────────────────────────────────────────────────────
# Course/AssessmentTemplate are lightweight reference tables mirroring the
# frontend's static data/courses.ts and data/assessmentTemplates.ts, kept in
# sync by frontend/scripts/sync-catalog.ts. Never hard-deletes — a course
# removed from the catalog is soft-disabled (is_active=false) so existing
# Enrollment/AssessmentAttempt FKs survive.

class CatalogCourse(BaseModel):
    id: str
    title: str
    track: str
    difficulty: str
    estimated_hours: int | None = None
    total_lessons: int


class CatalogAssessmentTemplate(BaseModel):
    id: str
    title: str
    subject: str
    difficulty: str
    question_count: int
    time_limit_minutes: int


class CatalogSyncRequest(BaseModel):
    courses: list[CatalogCourse]
    assessment_templates: list[CatalogAssessmentTemplate]


@router.post("/catalog/sync")
async def sync_catalog(
    body: CatalogSyncRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    incoming_course_ids = {c.id for c in body.courses}
    incoming_template_ids = {t.id for t in body.assessment_templates}

    existing_courses = {c.id: c for c in (await db.execute(select(Course))).scalars().all()}
    for c in body.courses:
        row = existing_courses.get(c.id)
        if row is None:
            row = Course(id=c.id)
            db.add(row)
        row.title = c.title
        row.track = c.track
        row.difficulty = c.difficulty
        row.estimated_hours = c.estimated_hours
        row.total_lessons = c.total_lessons
        row.is_active = True
    for cid, row in existing_courses.items():
        if cid not in incoming_course_ids:
            row.is_active = False

    existing_templates = {t.id: t for t in (await db.execute(select(AssessmentTemplate))).scalars().all()}
    for t in body.assessment_templates:
        row = existing_templates.get(t.id)
        if row is None:
            row = AssessmentTemplate(id=t.id)
            db.add(row)
        row.title = t.title
        row.subject = t.subject
        row.difficulty = t.difficulty
        row.question_count = t.question_count
        row.time_limit_minutes = t.time_limit_minutes
        row.is_active = True
    for tid, row in existing_templates.items():
        if tid not in incoming_template_ids:
            row.is_active = False

    await db.commit()
    return {
        "courses_synced": len(body.courses),
        "assessment_templates_synced": len(body.assessment_templates),
    }


# ── Student records ──────────────────────────────────────────────────────
# Deliberately separate from the Users list above: this surfaces academic
# records (enrollments, marks, certificates). Gender/race/nationality/job
# title/DOB are intentionally excluded from the list view and its filters —
# they only appear in the per-student detail view, under a clearly labeled
# "Profile (optional, self-reported)" section. Making protected
# characteristics filterable/searchable in a table is a different and worse
# thing than just storing them for a student's own record.

class AdminStudentListItem(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    plan: str
    is_locked: bool
    last_login_at: datetime | None
    created_at: datetime
    enrollments_count: int
    certificates_count: int


@router.get("/students", response_model=list[AdminStudentListItem])
async def list_students(
    q: str | None = None,
    plan: str | None = None,
    role: str = "student",
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if plan:
        query = query.where(User.plan == plan)
    if q:
        like = f"%{q.lower()}%"
        query = query.where(func.lower(User.full_name).like(like) | func.lower(User.email).like(like))
    users = (await db.execute(query.order_by(User.created_at.desc()))).scalars().all()

    if not users:
        return []
    user_ids = [u.id for u in users]

    enrollment_counts = dict((await db.execute(
        select(Enrollment.user_id, func.count()).where(Enrollment.user_id.in_(user_ids)).group_by(Enrollment.user_id)
    )).all())
    certificate_counts = dict((await db.execute(
        select(Certificate.user_id, func.count()).where(Certificate.user_id.in_(user_ids)).group_by(Certificate.user_id)
    )).all())

    return [
        AdminStudentListItem(
            id=u.id, email=u.email, full_name=u.full_name, role=u.role.value,
            plan=u.plan.value, is_locked=u.is_locked, last_login_at=u.last_login_at,
            created_at=u.created_at,
            enrollments_count=enrollment_counts.get(u.id, 0),
            certificates_count=certificate_counts.get(u.id, 0),
        )
        for u in users
    ]


class StudentProfile(BaseModel):
    first_name: str | None
    last_name: str | None
    date_of_birth: date | None
    gender: str | None
    job_title: str | None
    nationality: str | None
    race: str | None


class StudentEnrollment(BaseModel):
    course_id: str
    course_title: str
    status: str
    enrolled_at: datetime
    completed_at: datetime | None
    progress_percent: int


class StudentAttempt(BaseModel):
    template_id: str
    template_title: str
    completed_at: datetime | None
    total_score: int
    max_score: int
    percentage: int
    passed: bool


class StudentCertificate(BaseModel):
    verification_code: str
    course_name: str
    issued_at: datetime
    revoked: bool


class AdminStudentDetail(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    plan: str
    plan_source: str
    is_locked: bool
    last_login_at: datetime | None
    created_at: datetime
    profile: StudentProfile
    enrollments: list[StudentEnrollment]
    attempts: list[StudentAttempt]
    certificates: list[StudentCertificate]


@router.get("/students/{user_id}", response_model=AdminStudentDetail)
async def get_student_detail(user_id: int, admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = await _get_user_or_404(user_id, db)

    enrollment_rows = (await db.execute(
        select(Enrollment, Course.title)
        .join(Course, Course.id == Enrollment.course_id)
        .where(Enrollment.user_id == user_id)
        .order_by(Enrollment.enrolled_at.desc())
    )).all()

    attempt_rows = (await db.execute(
        select(AssessmentAttempt, AssessmentTemplate.title)
        .join(AssessmentTemplate, AssessmentTemplate.id == AssessmentAttempt.template_id)
        .where(AssessmentAttempt.user_id == user_id)
        .order_by(AssessmentAttempt.created_at.desc())
    )).all()

    certificates = (await db.execute(
        select(Certificate).where(Certificate.user_id == user_id).order_by(Certificate.issued_at.desc())
    )).scalars().all()

    return AdminStudentDetail(
        id=user.id, email=user.email, full_name=user.full_name, role=user.role.value,
        plan=user.plan.value, plan_source=user.plan_source.value, is_locked=user.is_locked,
        last_login_at=user.last_login_at, created_at=user.created_at,
        profile=StudentProfile(
            first_name=user.first_name, last_name=user.last_name, date_of_birth=user.date_of_birth,
            gender=user.gender.value if user.gender else None, job_title=user.job_title,
            nationality=user.nationality, race=user.race.value if user.race else None,
        ),
        enrollments=[
            StudentEnrollment(
                course_id=e.course_id, course_title=title, status=e.status.value,
                enrolled_at=e.enrolled_at, completed_at=e.completed_at, progress_percent=e.progress_percent,
            )
            for e, title in enrollment_rows
        ],
        attempts=[
            StudentAttempt(
                template_id=a.template_id, template_title=title, completed_at=a.completed_at,
                total_score=a.total_score, max_score=a.max_score, percentage=a.percentage, passed=a.passed,
            )
            for a, title in attempt_rows
        ],
        certificates=[
            StudentCertificate(
                verification_code=c.verification_code, course_name=c.course_name_snapshot,
                issued_at=c.issued_at, revoked=c.revoked,
            )
            for c in certificates
        ],
    )
