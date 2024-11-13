from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.product import Product, PartCategory, BrandCategory
from app.schemas.product import ProductCreate, ProductUpdate

import json
from app.crud import (
    add_and_commit,
    commit_and_refresh,
    delete_and_commit,
    get_product_by_id,
    get_product_by_brand,
    get_product_by_part,
    get_product_by_name,
    get_all_products,
    get_all_part_categories,
    get_all_brand_categories
)

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
    return add_and_commit(db, new_product)

#Update existing product
def modify_product(db: Session, product_id: int, product_update: ProductUpdate):

    #Get relevant product
    product = get_product_by_id(db=db, product_id=product_id)

    #Raise 400 Exception if product is not in DB
    if not product:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )
    
    existing_product = db.query(Product).filter(Product.name == product_update.name).first()
    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Product name invalid, Product Already Exists"
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

    return commit_and_refresh(db, product)

#Delete existing product
def delete_product(db: Session, product_id: int):
    product = get_product_by_id(db=db, product_id=product_id)

    #Raise 400 Exception if product is not in DB
    if not product:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )

    delete_and_commit(db, product)

    return {"detail": "Product Deleted Successfully"}
