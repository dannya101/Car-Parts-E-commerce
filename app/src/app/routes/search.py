from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

import app.services.product as product_services
from app.dependencies import get_db

router = APIRouter()


@router.get("/{search_terms}")
def get_products_from_search(search_terms: str, db: Session = Depends(get_db)):
    return product_services.get_product_by_name(db=db, name=search_terms)
