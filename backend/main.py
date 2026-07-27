from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.config.settings import settings
from app.exceptions.handlers import add_exception_handlers

app = FastAPI(
    title="Customer Complaint Management API",
    version="0.2.0",
)

if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

add_exception_handlers(app)
app.include_router(api_router, prefix="/api/v1")

@app.get("/api/v1/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
