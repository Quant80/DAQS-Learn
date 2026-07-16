from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, health, tutor, admin, records, certificates

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tutor.router, prefix="/tutor", tags=["tutor"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(records.router, prefix="/records", tags=["records"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["certificates"])
