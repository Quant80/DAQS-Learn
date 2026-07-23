from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.session import get_db
from app.services.promo import get_promo_status

router = APIRouter()


class PromoStatusResponse(BaseModel):
    granted: int
    cap: int
    remaining: int


@router.get("/python-status", response_model=PromoStatusResponse)
async def python_promo_status(db: AsyncSession = Depends(get_db)):
    """Public, no auth — aggregate count only, safe to show on marketing
    pages (e.g. a live 'X spots left' counter)."""
    return await get_promo_status(db)
