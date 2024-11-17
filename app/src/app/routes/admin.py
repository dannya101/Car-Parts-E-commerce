from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

import app.services.product as product_service
from app.dependencies import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, PartCategoryCreate, BrandCategoryCreate

router = APIRouter()


@router.post("/add-part-category")
def add_part_category(new_part: PartCategoryCreate, db: Session = Depends(get_db)):
    """
    Add a New Part Category

    This endpoint allows the creation of a new part category in the system.
    Part categories help in organizing products by their type or part.

    - **Parameters**:
        - `new_part` (PartCategoryCreate): The new part category details to be added, including name and description.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `PartCategory`: The newly created part category object.

    Example Request:
    ```http
    POST /products/add-part-category
    Content-Type: application/json

    {
        "name": "Electronics",
        "description": "All electronic items"
    }
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "name": "Electronics",
        "description": "All electronic items"
    }
    ```

    - **Notes**:
        - This endpoint is used to add new part categories, which can later be used to filter and categorize products.
    """
    return product_service.add_new_part_category(db=db, part=new_part)

@router.post("/add-brand-category")
def add_brand_category(new_brand: BrandCategoryCreate, db: Session = Depends(get_db)):
    """
    Add a New Brand Category

    This endpoint allows the creation of a new brand category in the system.
    Brand categories are used to organize products based on their brand.

    - **Parameters**:
        - `new_brand` (BrandCategoryCreate): The new brand category details to be added, including name and description.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `BrandCategory`: The newly created brand category object.

    Example Request:
    ```http
    POST /products/add-brand-category
    Content-Type: application/json

    {
        "name": "Brand A",
        "description": "Products from Brand A"
    }
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "name": "Brand A",
        "description": "Products from Brand A"
    }
    ```

    - **Notes**:
        - This endpoint is used to add new brand categories, which can be used to organize products by their brand.
    """
    return product_service.add_new_brand_category(db=db, brand=new_brand)

@router.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a New Product

    This endpoint allows the creation of a new product in the database,
    including details such as name, price, description, category, and brand.

    - **Parameters**:
        - `product` (ProductCreate): The product details to be created, including name, price, description, part category, and brand category.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Product`: The newly created product object.

    Example Request:
    ```http
    POST /products
    Content-Type: application/json

    {
        "name": "Product A",
        "price": 100,
        "description": "A great product",
        "part_category_id": 1,
        "brand_category_id": 1
    }
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "name": "Product A",
        "price": 100,
        "description": "A great product",
        "part_category_id": 1,
        "brand_category_id": 1
    }
    ```

    - **Notes**:
        - This endpoint is used to create new products in the system.
        - The `part_category_id` and `brand_category_id` should reference existing categories.
    """
    return product_service.create_new_product(db=db, product=product)

@router.put("/products/{product_id}")
def update_product(product_id: int, updated_product: ProductUpdate, db: Session = Depends(get_db)):
    """
    Update an Existing Product

    This endpoint allows updating an existing product's details, such as name, price, description, or category.

    - **Parameters**:
        - `product_id` (int): The unique ID of the product to be updated.
        - `updated_product` (ProductUpdate): The updated product details to modify, including fields like name, price, description, etc.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Product`: The updated product object.

    - **Raises**:
        - `HTTPException` (status code 404): If the product with the specified ID is not found.

    Example Request:
    ```http
    PUT /products/1
    Content-Type: application/json

    {
        "name": "Updated Product A",
        "price": 120,
        "description": "An updated description"
    }
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "name": "Updated Product A",
        "price": 120,
        "description": "An updated description",
        "part_category_id": 1,
        "brand_category_id": 1
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Product not found"
    }
    ```

    - **Notes**:
        - If the product does not exist, a 404 error will be raised.
    """
    return product_service.modify_product(db=db, product_id=product_id, product_update=updated_product)

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a Product

    This endpoint allows deleting a product from the system using its unique ID.

    - **Parameters**:
        - `product_id` (int): The unique ID of the product to be deleted.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message indicating the deletion was successful.

    - **Raises**:
        - `HTTPException` (status code 404): If the product with the specified ID is not found.

    Example Request:
    ```http
    DELETE /products/1
    ```

    Example Successful Response:
    ```json
    {
        "message": "Product successfully deleted"
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Product not found"
    }
    ```

    - **Notes**:
        - This endpoint permanently deletes the product with the specified ID.
        - If the product is not found, a 404 error will be raised.
    """
    return product_service.delete_product(db=db, product_id=product_id)
