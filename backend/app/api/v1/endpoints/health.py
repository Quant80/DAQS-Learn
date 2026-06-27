from fastapi import APIRouter
from app.db.session import check_db
from app.core.config import settings

router = APIRouter()


@router.get("")
async def health_check():
    db_ok = await check_db()
    return {
        "status": "ok",
        "database": "connected" if db_ok else "disconnected",
        "version": settings.API_VERSION,
    }
