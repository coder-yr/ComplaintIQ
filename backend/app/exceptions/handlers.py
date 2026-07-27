from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.exceptions.base import APIException
from app.schemas.common import (
    StandardResponse,
    ValidationErrorDetail,
    ValidationErrorResponse,
)


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=StandardResponse(success=False, message=str(exc.detail)).model_dump(exclude_none=True)
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        errors = [
            ValidationErrorDetail(
                loc=[str(loc) for loc in err["loc"]],
                msg=err["msg"],
                type=err["type"]
            )
            for err in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content=ValidationErrorResponse(detail=errors).model_dump(exclude_none=True)
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=StandardResponse(success=False, message=str(exc.detail)).model_dump(exclude_none=True)
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content=StandardResponse(success=False, message="Internal Server Error").model_dump(exclude_none=True)
        )
