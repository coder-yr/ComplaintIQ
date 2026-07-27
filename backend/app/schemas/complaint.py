import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ComplaintStatus, Priority, Severity


class ComplaintBase(BaseModel):
    customer_name: str
    product_id: uuid.UUID | None = None
    batch_number: str | None = None
    incident_date: date | None = None
    description: str
    severity: Severity = Severity.LOW
    priority: Priority = Priority.LOW

class CreateComplaintRequest(ComplaintBase):
    pass

class UpdateComplaintRequest(BaseModel):
    customer_name: str | None = None
    product_id: uuid.UUID | None = None
    batch_number: str | None = None
    incident_date: date | None = None
    description: str | None = None
    severity: Severity | None = None
    priority: Priority | None = None
    status: ComplaintStatus | None = None

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
