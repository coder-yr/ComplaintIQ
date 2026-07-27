import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.common import PaginationResponse, StandardResponse
from app.schemas.complaint import (
    ComplaintListResponse,
    ComplaintResponse,
    CreateComplaintRequest,
    UpdateComplaintRequest,
)
from app.services.complaint import ComplaintService

router = APIRouter()

@router.get("/search", response_model=PaginationResponse[ComplaintListResponse])
async def search_complaints(
    query: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> Any:
    items, total = await ComplaintService.search_complaints(db, query, skip, limit)
    pages = (total + limit - 1) // limit if total else 0
    return {
        "items": items,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }

@router.get("", response_model=PaginationResponse[ComplaintListResponse])
async def list_complaints(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> Any:
    items, total = await ComplaintService.get_all_complaints(db, skip, limit)
    pages = (total + limit - 1) // limit if total else 0
    return {
        "items": items,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }

@router.get("/statistics", response_model=StandardResponse[dict[str, int]])
async def get_statistics(db: AsyncSession = Depends(get_db)) -> Any:
    # Just a placeholder for actual statistics
    items, total = await ComplaintService.get_all_complaints(db, 0, 1)
    return StandardResponse(data={"total": total})

@router.get("/{id}", response_model=StandardResponse[ComplaintResponse])
async def get_complaint(id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> Any:
    complaint = await ComplaintService.get_complaint(db, id)
    return StandardResponse(data=complaint)

@router.post("", response_model=StandardResponse[ComplaintResponse], status_code=status.HTTP_201_CREATED)
async def create_complaint(
    request: CreateComplaintRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    complaint = await ComplaintService.create_complaint(db, request, user_id="system")
    return StandardResponse(message="Complaint saved successfully", data=complaint)

@router.put("/{id}", response_model=StandardResponse[ComplaintResponse])
async def update_complaint(
    id: uuid.UUID,
    request: UpdateComplaintRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    complaint = await ComplaintService.update_complaint(db, id, request, user_id="system")
    return StandardResponse(message="Complaint updated successfully", data=complaint)

@router.patch("/{id}/status", response_model=StandardResponse[ComplaintResponse])
async def update_complaint_status(
    id: uuid.UUID,
    request: UpdateComplaintRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    complaint = await ComplaintService.update_complaint(db, id, request, user_id="system")
    return StandardResponse(message="Complaint status updated successfully", data=complaint)

@router.delete("/{id}", response_model=StandardResponse[None])
async def delete_complaint(id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> Any:
    await ComplaintService.delete_complaint(db, id, user_id="system")
    return StandardResponse(message="Complaint deleted successfully")
