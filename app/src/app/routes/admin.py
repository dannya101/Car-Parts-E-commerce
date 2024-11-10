from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

import app.services.product as product_service
from app.dependencies import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

router = APIRouter()

#TODO: Add routes for creating new brand and part categories.
#TODO: Add routes for deleteing brand and part categories

@router.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_new_product(db=db, product=product)


@router.put("/products/{product_id}")
def update_product(product_id: int, product_new: ProductUpdate, db: Session = Depends(get_db)):
    return product_service.modify_product(db=db, product_id=product_id, product_update=product_new)



@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return product_service.delete_product(db=db, product_id=product_id)
