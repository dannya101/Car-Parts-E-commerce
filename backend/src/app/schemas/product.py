from pydantic import BaseModel, Field
from typing import List, Optional

class PartCategory(BaseModel):
    id: int
    part_type_name: str
    part_type_description: str

    class Config:
        orm_mode = True

class PartCategoryCreate(BaseModel):
    part_type_name: str
    part_type_description: str

    class Config:
        orm_mode = True

class BrandCategory(BaseModel):
    id: int
    brand_type_name: str
    brand_type_description: str

    class Config:
        orm_mode = True

class BrandCategoryCreate(BaseModel):
    brand_type_name: str
    brand_type_description: str

    class Config:
        orm_mode = True

class ModelCategory(BaseModel):
    id: int
    brand_id: int
    model_name: str

    class Config:
        orm_mode = True

class ModelCategoryCreate(BaseModel):
    brand_id: int
    model_name: str

class ProductBase(BaseModel):

    name: str
    description: str
    price: float = Field(..., gt=0)
    tags: List[str] = []
    images: List[str] = []
    thumbnail: str
    part_category_id: int
    brand_category_id: int
    model_category_id: int


class ProductCreate(ProductBase):

    pass

class ProductRead(ProductBase):
    product_id: int

    class Config:
        orm_mode: True

class ProductUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    part_category_id: Optional[int]
    brand_category_id: Optional[int]
    model_category_id: Optional[int]
    tags: Optional[List[str]]
    images: Optional[List[str]]
    thumbnail: Optional[str]

    class Config:
        orm_mode = True

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True
