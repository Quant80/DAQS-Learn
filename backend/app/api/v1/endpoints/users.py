from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import Gender, RaceCategory
from app.schemas.user import UserResponse, ProfileUpdateRequest
from app.services.auth_service import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.patch("/me/profile", response_model=UserResponse)
async def update_my_profile(
    body: ProfileUpdateRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    updates = body.model_dump(exclude_unset=True)

    if "gender" in updates and updates["gender"] is not None:
        try:
            updates["gender"] = Gender(updates["gender"])
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid gender value")

    if "race" in updates and updates["race"] is not None:
        try:
            updates["race"] = RaceCategory(updates["race"])
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid race value")

    for field, value in updates.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user
