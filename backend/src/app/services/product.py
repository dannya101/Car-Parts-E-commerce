from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.product import Product, PartCategory, BrandCategory, ModelCategory
from app.schemas.product import ProductCreate, ProductUpdate, PartCategoryCreate, BrandCategoryCreate, ModelCategoryCreate

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
    get_all_brand_categories,
    get_all_model_categories,
    get_model_categories_by_brand_id,
    get_part_category_by_name,
    get_brand_category_by_name,
    get_model_category_by_name,
    get_products_by_brand_and_model,
    get_products_by_brand_category_by_id,
    get_products_by_part_category_id,
    search_products_given_make
)

def create_new_product(db: Session, product: ProductCreate):
    """
    Creates a new product entry in the database.

    Parameters:
        db (Session): The database session.
        product (ProductCreate): The product schema with details for the new product.

    Returns:
        Product: The newly created product.

    Raises:
        HTTPException: If a product with the same name already exists.
    """

    if get_product_by_name(db, product.name):
        raise HTTPException(status_code=400, detail="Product Already has that name")

    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        part_category_id=product.part_category_id,
        brand_category_id=product.brand_category_id,
        model_category_id=product.model_category_id,
        thumbnail=product.thumbnail
    )

    new_product.set_tags(product.tags)
    new_product.set_images(product.images)

    return add_and_commit(db, new_product)

def modify_product(db: Session, product_id: int, product_update: ProductUpdate):
    """
    Updates an existing product in the database.

    Parameters:
        db (Session): The database session.
        product_id (int): The ID of the product to update.
        product_update (ProductUpdate): The schema containing updated product details.

    Returns:
        Product: The updated product.

    Raises:
        HTTPException: If the product does not exist or if the new name already exists.
    """

    product = get_product_by_id(db=db, product_id=product_id)

    if not product:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )

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

def delete_product(db: Session, product_id: int):
    """
    Deletes a product from the database.

    Parameters:
        db (Session): The database session.
        product_id (int): The ID of the product to delete.

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the product does not exist.
    """
    product = get_product_by_id(db=db, product_id=product_id)

    if not product:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )

    delete_and_commit(db, product)

    return {"detail": "Product Deleted Successfully"}

def add_new_part_category(db: Session, part: PartCategoryCreate):
    """
    Adds a new part category to the database.

    Parameters:
        db (Session): The database session.
        part (PartCategoryCreate): The schema for the new part category.

    Returns:
        PartCategory: The newly created part category.

    Raises:
        HTTPException: If the part category already exists.
    """
    if get_part_category_by_name(db=db, name=part.part_type_name):
        raise HTTPException(status_code=400, detail="Part Category Already Exists")

    new_part = PartCategory(
        part_type_name = part.part_type_name,
        part_type_description = part.part_type_description
    )

    add_and_commit(db=db, obj=new_part)
    return get_part_category_by_name(name=part.part_type_name, db=db)

def add_new_brand_category(db: Session, brand: BrandCategoryCreate):
    """
    Adds a new brand category to the database.

    Parameters:
        db (Session): The database session.
        brand (BrandCategoryCreate): The schema for the new brand category.

    Returns:
        BrandCategory: The newly created brand category.

    Raises:
        HTTPException: If the brand category already exists.
    """
    if get_brand_category_by_name(db=db, name=brand.brand_type_name):
        raise HTTPException(status_code=400, detail="Brand Already Exists")

    new_brand = BrandCategory(
        brand_type_name = brand.brand_type_name,
        brand_type_description = brand.brand_type_description
    )

    add_and_commit(db=db, obj=new_brand)
    return get_brand_category_by_name(db=db, name=brand.brand_type_name)

def add_new_model_category(db: Session, model: ModelCategoryCreate):
    if get_model_category_by_name(db=db, name=model.model_name):
        raise HTTPException(status_code=400, detail="Model Already Exists")

    new_model = ModelCategory(
        brand_id = model.brand_id,
        model_name = model.model_name
    )

    add_and_commit(db=db, obj=new_model)
    return get_model_category_by_name(db=db, name=new_model.model_name)
