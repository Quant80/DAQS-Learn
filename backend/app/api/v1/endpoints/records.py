import secrets
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User, Plan
from app.models.course import Course
from app.models.assessment_template import AssessmentTemplate
from app.models.enrollment import Enrollment, EnrollmentStatus, LessonCompletion
from app.models.assessment_attempt import AssessmentAttempt
from app.models.certificate import Certificate
from app.services.auth_service import get_current_user
from app.services.promo import PYTHON_PROMO_COURSE_IDS, PYTHON_PRO_ONLY_COURSE_IDS

# Crockford Base32 — avoids ambiguous 0/O, 1/I/L when a code is typed by hand.
_CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def _generate_verification_code() -> str:
    random_bits = int.from_bytes(secrets.token_bytes(7), "big")
    chars = []
    for _ in range(10):
        random_bits, rem = divmod(random_bits, 32)
        chars.append(_CROCKFORD_ALPHABET[rem])
    return f"DAQS-{datetime.utcnow().year}-{''.join(reversed(chars))}"

router = APIRouter()


# ── Courses / enrollment / progress ─────────────────────────────────────

async def _get_or_stub_course(course_id: str, db: AsyncSession) -> Course:
    """Reference-table drift guard: if the frontend catalog has a course the
    backend doesn't know about yet (sync-catalog wasn't run), create a
    placeholder row instead of 404ing and losing the student's action. Shows
    up as an obviously incomplete row (is_active=false, title=id) for an
    admin to notice and fix via a catalog sync."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if course is None:
        course = Course(id=course_id, title=course_id, track="", difficulty="", total_lessons=0, is_active=False)
        db.add(course)
        await db.flush()
    return course


class EnrollmentResponse(BaseModel):
    id: int
    course_id: str
    status: str
    enrolled_at: datetime
    completed_at: datetime | None
    progress_percent: int
    last_lesson_id: str | None
    last_module_id: str | None

    class Config:
        from_attributes = True


@router.post("/courses/{course_id}/enroll", response_model=EnrollmentResponse)
async def enroll(course_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if course_id in PYTHON_PRO_ONLY_COURSE_IDS and current_user.plan == Plan.free:
        raise HTTPException(status_code=403, detail="This course requires a Pro plan.")

    if (
        course_id in PYTHON_PROMO_COURSE_IDS
        and current_user.plan == Plan.free
        and not current_user.python_promo_granted
    ):
        raise HTTPException(
            status_code=403,
            detail="This course requires a Pro plan, or a free promo spot (the first 100 are already claimed).",
        )

    await _get_or_stub_course(course_id, db)
    result = await db.execute(
        select(Enrollment).where(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id)
    )
    enrollment = result.scalar_one_or_none()
    if enrollment is None:
        enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
        db.add(enrollment)
        await db.commit()
        await db.refresh(enrollment)
    return enrollment


class LessonCompleteRequest(BaseModel):
    module_id: str


class LessonCompleteResponse(BaseModel):
    enrollment: EnrollmentResponse
    certificate_issued: bool


@router.post("/courses/{course_id}/lessons/{lesson_id}/complete", response_model=LessonCompleteResponse)
async def complete_lesson(
    course_id: str,
    lesson_id: str,
    body: LessonCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    course = await _get_or_stub_course(course_id, db)

    result = await db.execute(
        select(Enrollment).where(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id)
    )
    enrollment = result.scalar_one_or_none()
    if enrollment is None:
        enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
        db.add(enrollment)
        await db.flush()

    existing = await db.execute(
        select(LessonCompletion).where(
            LessonCompletion.user_id == current_user.id,
            LessonCompletion.course_id == course_id,
            LessonCompletion.lesson_id == lesson_id,
        )
    )
    if existing.scalar_one_or_none() is None:
        db.add(LessonCompletion(
            user_id=current_user.id, course_id=course_id, module_id=body.module_id, lesson_id=lesson_id,
        ))

    enrollment.last_lesson_id = lesson_id
    enrollment.last_module_id = body.module_id

    await db.flush()
    count_result = await db.execute(
        select(func.count()).select_from(LessonCompletion).where(
            LessonCompletion.user_id == current_user.id,
            LessonCompletion.course_id == course_id,
        )
    )
    completed_count = count_result.scalar_one()

    enrollment.progress_percent = (
        min(100, round(completed_count / course.total_lessons * 100)) if course.total_lessons > 0 else 0
    )

    certificate_issued = False
    if enrollment.progress_percent >= 100 and enrollment.completed_at is None:
        enrollment.completed_at = datetime.utcnow()
        enrollment.status = EnrollmentStatus.completed
        certificate_issued = await _issue_certificate_if_needed(current_user, course, enrollment, db)

    await db.commit()
    await db.refresh(enrollment)
    return LessonCompleteResponse(enrollment=enrollment, certificate_issued=certificate_issued)


async def _issue_certificate_if_needed(current_user: User, course: Course, enrollment: Enrollment, db: AsyncSession) -> bool:
    existing = await db.execute(
        select(Certificate).where(Certificate.user_id == current_user.id, Certificate.course_id == course.id)
    )
    if existing.scalar_one_or_none() is not None:
        return False

    # Retry on the rare code collision (unique index is the real guard).
    # Each attempt runs in its own SAVEPOINT so a collision only rolls back
    # the certificate insert, not the enrollment/progress changes already
    # made earlier in this same transaction.
    for _ in range(5):
        try:
            async with db.begin_nested():
                db.add(Certificate(
                    verification_code=_generate_verification_code(),
                    user_id=current_user.id,
                    course_id=course.id,
                    enrollment_id=enrollment.id,
                    course_name_snapshot=course.title,
                    course_track_snapshot=course.track,
                    difficulty_snapshot=course.difficulty,
                    student_name_snapshot=current_user.full_name,
                ))
                await db.flush()
            return True
        except Exception:
            continue
    return False


@router.get("/courses/{course_id}/progress", response_model=EnrollmentResponse)
async def get_progress(course_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Enrollment).where(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id)
    )
    enrollment = result.scalar_one_or_none()
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Not enrolled")
    return enrollment


# ── Assessments ──────────────────────────────────────────────────────────

class AnswerIn(BaseModel):
    question_id: str
    answer: str | int | None = None
    score: int
    max_score: int


class AttemptRequest(BaseModel):
    started_at: datetime
    answers: list[AnswerIn]


class AttemptResponse(BaseModel):
    id: int
    template_id: str
    started_at: datetime
    completed_at: datetime | None
    total_score: int
    max_score: int
    percentage: int
    passed: bool

    class Config:
        from_attributes = True


async def _get_or_stub_template(template_id: str, db: AsyncSession) -> AssessmentTemplate:
    result = await db.execute(select(AssessmentTemplate).where(AssessmentTemplate.id == template_id))
    template = result.scalar_one_or_none()
    if template is None:
        template = AssessmentTemplate(
            id=template_id, title=template_id, subject="", difficulty="",
            question_count=0, time_limit_minutes=0, is_active=False,
        )
        db.add(template)
        await db.flush()
    return template


@router.post("/assessments/{template_id}/attempts", response_model=AttemptResponse)
async def submit_attempt(
    template_id: str,
    body: AttemptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    template = await _get_or_stub_template(template_id, db)

    # Server clamps and recomputes — never trusts a client-sent total/percentage.
    total_score = 0
    max_score = 0
    clamped_answers = []
    for a in body.answers:
        clamped_score = max(0, min(a.score, a.max_score))
        total_score += clamped_score
        max_score += a.max_score
        clamped_answers.append({
            "question_id": a.question_id, "answer": a.answer,
            "score": clamped_score, "max_score": a.max_score,
        })

    percentage = round(total_score / max_score * 100) if max_score > 0 else 0
    pass_mark = template.pass_mark_percent if template.is_active else 50
    passed = percentage >= pass_mark

    started_at = body.started_at.replace(tzinfo=None) if body.started_at.tzinfo else body.started_at
    attempt = AssessmentAttempt(
        user_id=current_user.id,
        template_id=template_id,
        started_at=started_at,
        completed_at=datetime.utcnow(),
        total_score=total_score,
        max_score=max_score,
        percentage=percentage,
        passed=passed,
        answers=clamped_answers,
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    return attempt


@router.get("/assessments/{template_id}/attempts", response_model=list[AttemptResponse])
async def list_attempts(template_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AssessmentAttempt)
        .where(AssessmentAttempt.user_id == current_user.id, AssessmentAttempt.template_id == template_id)
        .order_by(AssessmentAttempt.created_at.desc())
    )
    return result.scalars().all()


# ── Aggregate own-record view ───────────────────────────────────────────

class MyRecordResponse(BaseModel):
    enrollments: list[EnrollmentResponse]
    attempts: list[AttemptResponse]


@router.get("/me", response_model=MyRecordResponse)
async def my_record(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    enrollments = (await db.execute(
        select(Enrollment).where(Enrollment.user_id == current_user.id)
    )).scalars().all()
    attempts = (await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.user_id == current_user.id)
        .order_by(AssessmentAttempt.created_at.desc())
    )).scalars().all()
    return MyRecordResponse(enrollments=enrollments, attempts=attempts)
