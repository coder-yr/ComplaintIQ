from pydantic import BaseModel

class AuditLogCreate(BaseModel):
    user_id: str | None = None
    action: str
    entity: str
    entity_id: str
    previous_state: str | None = None
    new_state: str | None = None

class AuditLogUpdate(AuditLogCreate):
    pass
