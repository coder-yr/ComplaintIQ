from fastapi import APIRouter

from app.api.v1.endpoints import complaints, ai

api_router = APIRouter()
api_router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
api_router.include_router(ai.router, prefix="/complaints", tags=["ai"])
