from pydantic import BaseModel
from typing import List

from datetime import datetime

from app.schemas.product import Product

class CartItem(BaseModel):
    product: Product
    quantity: int

    class Config:
        orm_mode = True

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    product_id: int
    quantity: int

class CartItemUpdate(BaseModel):
    product_id: int
    quantity: int

class CartItemResponse(CartItemBase):
    id: int
    price: float

    class Config:
        orm_mode = True

class Cart(BaseModel):
    items: List[CartItem]
    total_price: float = 0

    class Config:
        orm_mode = True

class CartBase(BaseModel):
    user_id: int

class CartCreate(CartBase):
    pass

class CartResponse(CartBase):
    id: int
    items: List[CartItemResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
