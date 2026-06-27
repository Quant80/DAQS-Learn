from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "DAQS Learn"
    DEBUG: bool = False
    API_VERSION: str = "v1"

    DATABASE_URL: str = "postgresql+asyncpg://daqs:daqs_password@db:5432/daqs_learn"
    REDIS_URL: str = "redis://redis:6379/0"

    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_CLIENT_EMAIL: str = ""

    CLAUDE_API_KEY: str = ""

    CLOUDFLARE_R2_ACCOUNT_ID: str = ""
    CLOUDFLARE_R2_ACCESS_KEY: str = ""
    CLOUDFLARE_R2_SECRET_KEY: str = ""
    CLOUDFLARE_R2_BUCKET: str = "daqs-learn"

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://learn.daqstech.com",
    ]

    JWT_SECRET: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"


settings = Settings()
