from pydantic import BaseModel
from typing import List, Dict

from datetime import datetime

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
