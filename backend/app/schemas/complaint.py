import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ComplaintStatus, Priority, Severity


from typing import Any, Dict, Optional

class FieldMetadata(BaseModel):
    value: Any = None
    source: str = "AI"
    confidence: float = 0.0
    userEdited: bool = False

class ComplaintBase(BaseModel):
    customer_name: str
    complaint_source: str | None = None
    product_id: uuid.UUID | None = None
    product_strength: str | None = None
    batch_number: str | None = None
    manufacturing_date: date | None = None
    expiry_date: date | None = None
    quantity_affected: str | None = None
    complaint_type: str | None = None
    complaint_date: date | None = None
    incident_date: date | None = None
    description: str
    severity: Severity = Severity.LOW
    priority: Priority = Priority.LOW
    metadata_info: Dict[str, Any] | None = None

class CreateComplaintRequest(ComplaintBase):
    pass

class UpdateComplaintRequest(BaseModel):
    customer_name: str | None = None
    complaint_source: str | None = None
    product_id: uuid.UUID | None = None
    product_strength: str | None = None
    batch_number: str | None = None
    manufacturing_date: date | None = None
    expiry_date: date | None = None
    quantity_affected: str | None = None
    complaint_type: str | None = None
    complaint_date: date | None = None
    incident_date: date | None = None
    description: str | None = None
    severity: Severity | None = None
    priority: Priority | None = None
    status: ComplaintStatus | None = None
    metadata_info: Dict[str, Any] | None = None

class ComplaintResponse(ComplaintBase):
    id: uuid.UUID
    complaint_number: str
    status: ComplaintStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ComplaintListResponse(BaseModel):
    id: uuid.UUID
    complaint_number: str
    customer_name: str
    incident_date: date | None = None
    severity: Severity
    priority: Priority
    status: ComplaintStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
