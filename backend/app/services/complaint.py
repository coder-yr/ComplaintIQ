import datetime
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.base import APIException
from app.models.complaint import Complaint
from app.repositories import audit_repo, complaint_repo
from app.schemas.complaint import CreateComplaintRequest, UpdateComplaintRequest


class ComplaintService:
    @staticmethod
    async def create_complaint(session: AsyncSession, data: CreateComplaintRequest, user_id: str | None = None) -> Complaint:
        year = datetime.datetime.now().year
        count = await complaint_repo.count_all(session)
        complaint_number = f"CMP-{year}-{(count + 1):06d}"
        
        create_data = data.model_dump()
        create_data["complaint_number"] = complaint_number
        
        complaint = await complaint_repo.create(session, create_data)
        
        await audit_repo.log_action(
            session=session,
            user_id=user_id,
            action="CREATE",
            entity="Complaint",
            entity_id=str(complaint.id),
            new_state=str(create_data)
        )
        return complaint

    @staticmethod
    async def get_complaint(session: AsyncSession, id: uuid.UUID) -> Complaint:
        complaint = await complaint_repo.get_by_id(session, id)
        if not complaint:
            raise APIException(status_code=404, detail="Complaint not found")
        return complaint

    @staticmethod
    async def get_all_complaints(session: AsyncSession, skip: int = 0, limit: int = 100) -> tuple[list[Complaint], int]:
        items = await complaint_repo.get_all(session, skip=skip, limit=limit)
        total = await complaint_repo.count_all(session)
        return items, total

    @staticmethod
    async def update_complaint(session: AsyncSession, id: uuid.UUID, data: UpdateComplaintRequest, user_id: str | None = None) -> Complaint:
        complaint = await ComplaintService.get_complaint(session, id)
        previous_state = {c.name: str(getattr(complaint, c.name)) for c in complaint.__table__.columns}
        
        updated_complaint = await complaint_repo.update(session, db_obj=complaint, obj_in=data)
        
        await audit_repo.log_action(
            session=session,
            user_id=user_id,
            action="UPDATE",
            entity="Complaint",
            entity_id=str(complaint.id),
            previous_state=str(previous_state),
            new_state=str(data.model_dump(exclude_unset=True))
        )
        return updated_complaint

    @staticmethod
    async def delete_complaint(session: AsyncSession, id: uuid.UUID, user_id: str | None = None) -> None:
        await ComplaintService.get_complaint(session, id)
        await complaint_repo.delete(session, id)
        await audit_repo.log_action(
            session=session,
            user_id=user_id,
            action="DELETE",
            entity="Complaint",
            entity_id=str(id)
        )

    @staticmethod
    async def search_complaints(session: AsyncSession, query: str, skip: int = 0, limit: int = 10) -> tuple[list[Complaint], int]:
        return await complaint_repo.search_complaints(session, query, skip, limit)
