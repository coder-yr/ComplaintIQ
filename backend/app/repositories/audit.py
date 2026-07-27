import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog
from app.schemas.audit import AuditLogCreate, AuditLogUpdate

from .base import BaseRepository


class AuditRepository(BaseRepository[AuditLog, AuditLogCreate, AuditLogUpdate]):
    def __init__(self) -> None:
        super().__init__(AuditLog)

    async def get_by_id(self, session: AsyncSession, id: uuid.UUID) -> AuditLog | None:
        result = await session.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_all(self, session: AsyncSession, skip: int = 0, limit: int = 100) -> list[AuditLog]:
        result = await session.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def delete(self, session: AsyncSession, id: uuid.UUID) -> None:
        raise NotImplementedError("Audit logs cannot be deleted.")

    async def log_action(self, session: AsyncSession, user_id: str | None, action: str, entity: str, entity_id: str, previous_state: str | None = None, new_state: str | None = None) -> AuditLog:
        return await self.create(session, AuditLogCreate(
            user_id=user_id,
            action=action,
            entity=entity,
            entity_id=entity_id,
            previous_state=previous_state,
            new_state=new_state
        ))

audit_repo = AuditRepository()
