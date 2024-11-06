from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

import app.services.product as product_service
from app.schemas.product import Product
from app.dependencies import get_db


router = APIRouter()


@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = product_service.get_all_products(db)

    if not products:
        raise HTTPException(
            status_code=400,
            detail="No Products Found!",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return products


@router.get("/{id}")
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = product_service.get_product_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=400,
            detail="Product not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return product


@router.get("/partcategories")
def get_part_categories(db: Session = Depends(get_db)):
    part_categories = product_service.get_all_part_categories(db)

    if not part_categories:
        raise HTTPException(
            status_code=400,
            detail="Part Categories Not Found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return part_categories


@router.get("/{part_cagegory_id}")
def get_product_by_part():
    pass


@router.get("/{brand_category_id}")
def get_product_by_brand():
    pass


@router.get("/brandcategories")
def get_brand_categories(db: Session = Depends(get_db)):
    brand_categories = product_service.get_all_part_categories(db)

    if not brand_categories:
        raise HTTPException(
            status_code=400,
            detail="Brand Categories Not Found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return brand_categories
