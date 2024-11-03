from fastapi import APIRouter

from app.routes import user

api_router = APIRouter()

api_router.include_router(user.router, prefix="/users", tags=["Users"])
