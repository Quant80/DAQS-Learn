from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, health, tutor, admin

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tutor.router, prefix="/tutor", tags=["tutor"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
