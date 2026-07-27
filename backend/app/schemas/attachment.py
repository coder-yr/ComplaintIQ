import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AttachmentBase(BaseModel):
    file_name: str
    file_url: str

class AttachmentResponse(AttachmentBase):
    id: uuid.UUID
    complaint_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
