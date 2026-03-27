"""
ReSync AI — Backend Configuration
All env vars are typed and validated on startup.
App refuses to start if any required var is missing.
"""
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from functools import lru_cache


class Settings(BaseSettings):
    # ── Database ──
    DATABASE_URL: str = Field(
        ...,
        description="PostgreSQL async connection string"
    )

    # ── Auth ──
    JWT_SECRET: str = Field(
        ...,
        min_length=32,
        description="JWT signing secret — minimum 32 characters"
    )
    JWT_EXPIRY_HOURS: int = Field(default=24)
    SUPABASE_URL: str = Field(default="")
    SUPABASE_ANON_KEY: str = Field(default="")
    SUPABASE_JWT_SECRET: str = Field(default="")

    # ── Groq AI ──
    GROQ_API_KEY: str = Field(
        ...,
        description="Groq API key starting with gsk_"
    )
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile")
    GROQ_MAX_RETRIES: int = Field(default=1)
    GROQ_RETRY_DELAY_SECONDS: float = Field(default=2.0)

    # ── Cloudflare R2 ──
    R2_ACCESS_KEY_ID: str = Field(default="")
    R2_SECRET_ACCESS_KEY: str = Field(default="")
    R2_BUCKET_NAME: str = Field(default="resyncc-files")
    R2_ENDPOINT_URL: str = Field(default="")
    R2_PUBLIC_URL: str = Field(default="")

    # ── Stripe ──
    STRIPE_SECRET_KEY: str = Field(default="")
    STRIPE_WEBHOOK_SECRET: str = Field(default="")
    STRIPE_PRO_PRICE_ID: str = Field(default="")

    # ── App Config ──
    FRONTEND_URL: str = Field(default="http://localhost:3000")
    MAX_JD_LENGTH: int = Field(default=8000)
    FREE_TIER_SESSION_LIMIT: int = Field(default=3)
    PRO_TIER_SESSION_LIMIT: int = Field(default=50)
    SESSION_TIMEOUT_MINUTES: int = Field(default=5)
    SIGNED_URL_EXPIRY_SECONDS: int = Field(default=900)  # 15 mins

    # ── Server ──
    DEBUG: bool = Field(default=False)
    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v.startswith("postgresql"):
            raise ValueError(
                "DATABASE_URL must start with 'postgresql' "
                "(use postgresql+asyncpg:// for async)"
            )
        return v

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached settings singleton — validated once at startup."""
    return Settings()
