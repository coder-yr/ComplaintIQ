from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.complaint import Complaint
from app.schemas.complaint import CreateComplaintRequest, UpdateComplaintRequest

from .base import BaseRepository


class ComplaintRepository(BaseRepository[Complaint, CreateComplaintRequest, UpdateComplaintRequest]):
    def __init__(self) -> None:
        super().__init__(Complaint)

    async def search_complaints(self, session: AsyncSession, query: str, skip: int = 0, limit: int = 10) -> tuple[list[Complaint], int]:
        stmt = select(Complaint).filter(
            Complaint.is_deleted == False,
            (Complaint.customer_name.ilike(f"%{query}%")) | (Complaint.complaint_number.ilike(f"%{query}%"))
        )
        result = await session.execute(stmt.offset(skip).limit(limit))
        items = list(result.scalars().all())
        
        count_stmt = select(func.count(Complaint.id)).filter(
            Complaint.is_deleted == False,
            (Complaint.customer_name.ilike(f"%{query}%")) | (Complaint.complaint_number.ilike(f"%{query}%"))
        )
        total = await session.scalar(count_stmt)
        return items, total or 0

    async def count_all(self, session: AsyncSession) -> int:
        count_stmt = select(func.count(Complaint.id)).filter(Complaint.is_deleted == False)
        return (await session.scalar(count_stmt)) or 0

complaint_repo = ComplaintRepository()
