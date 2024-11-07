from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.product import Product, PartCategory, BrandCategory
from app.schemas.product import ProductCreate, ProductUpdate

import json

#CRUD operations
def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_brand(db: Session, brand_category_id: int):
    return db.query(Product).filter(Product.brand_category_id == brand_category_id).first()

def get_product_by_part(db: Session, part_category_id: int):
    return db.query(Product).filter(Product.part_category_id == part_category_id).first()

def get_product_by_name(db: Session, name: int):
    return db.query(Product).filter(Product.name == name).first()

def get_all_products(db: Session):
    return db.query(Product).all()

def get_all_part_categories(db: Session):
    return db.query(PartCategory).all()

def get_all_brand_categories(db: Session):
    return db.query(BrandCategory).all()


#Create new product - run by admin/products/
def create_new_product(db: Session, product: ProductCreate):

    #Raise Exception 400 if product is not found in DB
    if get_product_by_name(db, product.name):
        raise HTTPException(status_code=400, detail="Product Already has that name")

    #Populate the new product model
    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        part_category_id=product.part_category_id,
        brand_category_id=product.brand_category_id,
        thumbnail=product.thumbnail
    )

    #Populate the tags and images list
    new_product.set_tags(product.tags)
    new_product.set_images(product.images)

    #Add changes to the DB
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

#Update existing product
def modify_product(db: Session, product_id: int, product_update: ProductUpdate):

    #Get relevant product
    product = db.query(Product).filter(Product.id == product_id).first()

    #Raise 400 Exception if product is not in DB
    if not product:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )

    #Populate the data that needs to update
    if product_update.name is not None:
        product.name = product_update.name
    if product_update.description is not None:
        product.description = product_update.description
    if product_update.price is not None:
        product.price = product_update.price
    if product_update.part_category_id is not None:
        product.part_category_id = product_update.part_category_id
    if product_update.brand_category_id is not None:
        product.brand_category_id = product_update.brand_category_id
    if product_update.tags is not None:
        product.tags = json.dumps(product_update.tags)
    if product_update.images is not None:
        product.images = json.dumps(product_update.images)
    if product_update.thumbnail is not None:
        product.thumbnail = product_update.thumbnail

    db.commit()
    db.refresh(product)

    return product

#Delete existing product
def delete_product(db: Session, product_id: int):
    product = get_product_by_id(db=db, product_id=product_id)

    #Raise 400 Exception if product is not in DB
    if not product:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )

    db.delete(product)
    db.commit()

    return {"detail": "Product Deleted Successfully"}
