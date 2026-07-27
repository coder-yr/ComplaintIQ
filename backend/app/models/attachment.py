import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import AuditMixin, SoftDeleteMixin, TimestampMixin


class Attachment(Base, TimestampMixin, AuditMixin, SoftDeleteMixin):
    __tablename__ = "attachments"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    complaint_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("complaints.id"), index=True)
    file_name: Mapped[str] = mapped_column(String)
    file_url: Mapped[str] = mapped_column(String)
    
    complaint = relationship("Complaint", back_populates="attachments")
