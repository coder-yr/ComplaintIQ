import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin
from app.models.enums import ComplaintStatus, Priority, Severity


class Complaint(Base, TimestampMixin, AuditMixin, SoftDeleteMixin):
    __tablename__ = "complaints"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    complaint_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    customer_name: Mapped[str] = mapped_column(String, index=True)
    product_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    batch_number: Mapped[str | None] = mapped_column(String, nullable=True)
    incident_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    description: Mapped[str] = mapped_column(Text)
    
    severity: Mapped[Severity] = mapped_column(SQLEnum(Severity), default=Severity.LOW, index=True)
    priority: Mapped[Priority] = mapped_column(SQLEnum(Priority), default=Priority.LOW, index=True)
    status: Mapped[ComplaintStatus] = mapped_column(SQLEnum(ComplaintStatus), default=ComplaintStatus.OPEN, index=True)
    
    product = relationship("Product", back_populates="complaints")
    attachments = relationship("Attachment", back_populates="complaint", cascade="all, delete-orphan")
