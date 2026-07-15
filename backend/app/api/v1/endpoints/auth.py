from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import FirebaseTokenRequest, TokenResponse
from app.services.auth_service import verify_firebase_token, create_or_get_user

router = APIRouter()


@router.post("/firebase", response_model=TokenResponse)
async def firebase_login(
    request: FirebaseTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    firebase_user = await verify_firebase_token(request.id_token)
    if not firebase_user:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    token = await create_or_get_user(firebase_user, db)
    return token
