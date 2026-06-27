from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.services.auth_service import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return current_user
