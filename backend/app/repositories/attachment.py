from app.models.attachment import Attachment
from app.schemas.attachment import AttachmentBase

from .base import BaseRepository


class AttachmentRepository(BaseRepository[Attachment, AttachmentBase, AttachmentBase]):
    def __init__(self) -> None:
        super().__init__(Attachment)

attachment_repo = AttachmentRepository()
