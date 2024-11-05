from pydantic import BaseModel, Field
from typing import List

class PartCategory(BaseModel):
    id: int
    part_type_name: str
    part_type_description: str

class BrandCategory(BaseModel):
    id: int
    brand_type_name: str
    brand_type_description: str

class Product(BaseModel):

    id: int
    name: str
    description: str
    price: float = Field(..., gt=0)
    part_category_id: int
    brand_category_id: int
    tags: List[str] = []
    images: List[str] = []
    thumbnail: str

    class Config:
        orm_mode = True
