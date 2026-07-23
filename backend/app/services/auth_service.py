from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth, credentials, initialize_app
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.sql import func
import jwt
from datetime import datetime, timedelta

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.auth import TokenResponse
from app.services.promo import maybe_grant_python_promo

ADMIN_EMAIL_DOMAIN = "@daqstech.com"

bearer_scheme = HTTPBearer()

_firebase_initialized = False


def _init_firebase():
    global _firebase_initialized
    if not _firebase_initialized and settings.FIREBASE_PROJECT_ID:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        initialize_app(cred)
        _firebase_initialized = True


async def verify_firebase_token(id_token: str) -> dict | None:
    _init_firebase()
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except Exception:
        return None


async def create_or_get_user(
    firebase_user: dict,
    db: AsyncSession,
) -> TokenResponse:
    result = await db.execute(
        select(User).where(User.firebase_uid == firebase_user["uid"])
    )
    user = result.scalar_one_or_none()

    if not user:
        email = firebase_user.get("email", "")
        user = User(
            firebase_uid=firebase_user["uid"],
            email=email,
            full_name=firebase_user.get("name", ""),
            avatar_url=firebase_user.get("picture"),
            # @daqstech.com accounts are trusted staff — admin panel access is
            # also gated on this same domain check at request time, so this
            # is just where the role gets set, not the actual security boundary.
            role=UserRole.admin if email.lower().endswith(ADMIN_EMAIL_DOMAIN) else UserRole.student,
        )
        db.add(user)
        await maybe_grant_python_promo(user, db)
        await db.commit()
        await db.refresh(user)

    user.last_login_at = func.now()
    await db.commit()
    await db.refresh(user)

    token = _create_jwt(user)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
    )


def _create_jwt(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value,
        "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.is_locked:
        raise HTTPException(status_code=403, detail="This account has been locked. Contact the administrator.")
    return user


async def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.admin or not user.email.lower().endswith(ADMIN_EMAIL_DOMAIN):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
