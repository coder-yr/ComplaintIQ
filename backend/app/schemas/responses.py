from typing import Any

from pydantic import BaseModel


class ErrorResponse(BaseModel):
    detail: str


class SuccessResponse(BaseModel):
    message: str
    data: dict[str, Any] | None = None
