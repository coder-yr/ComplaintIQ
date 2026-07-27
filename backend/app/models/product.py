import uuid

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import SoftDeleteMixin, TimestampMixin


class Product(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "products"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, index=True)
    type: Mapped[str | None] = mapped_column(String, nullable=True)
    formulation: Mapped[str | None] = mapped_column(String, nullable=True)
    active_ingredients: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    complaints = relationship("Complaint", back_populates="product", cascade="all, delete-orphan")
