from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

import app.services.product as product_service
from app.dependencies import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, PartCategoryCreate, BrandCategoryCreate

router = APIRouter()


@router.post("/add-part-category")
def add_part_category(new_part: PartCategoryCreate, db: Session = Depends(get_db)):
    return product_service.add_new_part_category(db=db, part=new_part)

@router.post("/add-brand-category")
def add_brand_category(new_brand: BrandCategoryCreate, db: Session = Depends(get_db)):
    return product_service.add_new_brand_category(db=db, brand=new_brand)

@router.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_new_product(db=db, product=product)


@router.put("/products/{product_id}")
def update_product(product_id: int, product_new: ProductUpdate, db: Session = Depends(get_db)):
    return product_service.modify_product(db=db, product_id=product_id, product_update=product_new)



@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return product_service.delete_product(db=db, product_id=product_id)
