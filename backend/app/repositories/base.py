import uuid
from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: type[ModelType]):
        self.model = model

    async def get_by_id(self, session: AsyncSession, id: uuid.UUID) -> ModelType | None:
        result = await session.execute(select(self.model).filter(self.model.id == id, self.model.is_deleted == False))  # type: ignore[attr-defined]
        return result.scalars().first()

    async def get_all(self, session: AsyncSession, skip: int = 0, limit: int = 100) -> list[ModelType]:
        result = await session.execute(
            select(self.model).filter(self.model.is_deleted == False).offset(skip).limit(limit)  # type: ignore[attr-defined]
        )
        return list(result.scalars().all())

    async def create(self, session: AsyncSession, obj_in: CreateSchemaType | dict[str, Any]) -> ModelType:
        obj_in_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        db_obj = self.model(**obj_in_data)
        session.add(db_obj)
        await session.flush()
        return db_obj

    async def update(self, session: AsyncSession, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, Any]) -> ModelType:
        obj_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, obj_data[field])
        session.add(db_obj)
        await session.flush()
        return db_obj

    async def delete(self, session: AsyncSession, id: uuid.UUID) -> None:
        # Soft delete
        await session.execute(
            update(self.model).where(self.model.id == id).values(is_deleted=True)  # type: ignore[attr-defined]
        )
        await session.flush()
