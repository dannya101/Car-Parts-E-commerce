from sqlalchemy.orm import Session

from app.models.product import Product, PartCategory, BrandCategory

def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_brand(db: Session, brand_category_id: int):
    return db.query(Product).filter(Product.brand_category_id == brand_category_id).first()

def get_product_by_part(db: Session, part_category_id: int):
    return db.query(Product).filter(Product.part_category_id == part_category_id).first()

def get_all_products(db: Session):
    return db.query(Product).all()

def get_all_part_categories(db: Session):
    return db.query(PartCategory).all()

def get_all_brand_categories(db: Session):
    return db.query(BrandCategory).all()
