from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.core.logging_config import logger
import time

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        logger.info(f"Incoming Request: {request.method} {request.url}")
        logger.info(f"Headers: {request.headers}")

        response = await call_next(request)

        process_time = time.time() - start_time
        logger.info(f"Completed in {process_time:.4f}s with status code {response.status_code}")

        return response
