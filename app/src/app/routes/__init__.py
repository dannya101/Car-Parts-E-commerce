from fastapi import APIRouter

from app.routes import user, product

api_router = APIRouter()

api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(product.router, prefix="/product", tags=["Products"])
