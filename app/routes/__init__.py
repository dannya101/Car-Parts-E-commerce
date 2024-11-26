from fastapi import APIRouter

from app.routes import admin, cart, checkout, orders, product, search, support, user

api_router = APIRouter()

api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(product.router, prefix="/product", tags=["Products"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
api_router.include_router(checkout.router, prefix="/checkout", tags=["Checkout"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(support.router, prefix="/support", tags=["Support"])
