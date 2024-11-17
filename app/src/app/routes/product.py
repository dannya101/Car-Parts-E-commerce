from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

import app.services.product as product_service
from app.dependencies import get_db


router = APIRouter()


@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    """
    Retrieve All Products

    This endpoint retrieves all products from the database.

    - **Parameters**:
        - `db` (Session): A database session dependency for querying product data.

    - **Returns**:
        - `List[Product]`: A list of all products in the system.

    - **Raises**:
        - `HTTPException` (status code 400): If no products are found in the database.

    Example Request:
    ```http
    GET /products
    ```

    Example Successful Response:
    ```json
    [
        {
            "id": 1,
            "name": "Product A",
            "price": 100,
            "category": "Electronics"
        },
        ...
    ]
    ```

    Example Error Response:
    ```json
    {
        "detail": "No Products Found!"
    }
    ```

    - **Notes**:
        - This endpoint is designed to return all available products in the database.
    """
    products = product_service.get_all_products(db)

    if not products:
        raise HTTPException(
            status_code=400,
            detail="No Products Found!",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return products


@router.get("/get")
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a Product by ID

    This endpoint retrieves a single product from the database based on its unique ID.

    - **Parameters**:
        - `product_id` (int): The unique ID of the product to retrieve.
        - `db` (Session): A database session dependency for querying the product data.

    - **Returns**:
        - `Product`: The product with the specified ID.

    - **Raises**:
        - `HTTPException` (status code 400): If the product with the specified ID is not found.

    Example Request:
    ```http
    GET /products/get?product_id=1
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "name": "Product A",
        "price": 100,
        "category": "Electronics"
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Product not found"
    }
    ```

    - **Notes**:
        - If the product does not exist, a 400 error with the message `"Product not found"` will be returned.
    """
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
    """
    Retrieve All Part Categories

    This endpoint retrieves all part categories from the database.

    - **Parameters**:
        - `db` (Session): A database session dependency for querying part category data.

    - **Returns**:
        - `List[str]`: A list of all part categories.

    - **Raises**:
        - `HTTPException` (status code 400): If no part categories are found.

    Example Request:
    ```http
    GET /products/partcategories
    ```

    Example Successful Response:
    ```json
    [
        "Tires",
        "Oil Filters",
        "Floormats"
    ]
    ```

    Example Error Response:
    ```json
    {
        "detail": "Part Categories Not Found"
    }
    ```

    - **Notes**:
        - This endpoint is used to fetch all available part categories in the system.
    """
    part_categories = product_service.get_all_part_categories(db)

    if not part_categories:
        raise HTTPException(
            status_code=400,
            detail="Part Categories Not Found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return part_categories

@router.get("/brandcategories")
def get_brand_categories(db: Session = Depends(get_db)):
    """
    Retrieve All Brand Categories

    This endpoint retrieves all brand categories from the database.

    - **Parameters**:
        - `db` (Session): A database session dependency for querying brand category data.

    - **Returns**:
        - `List[str]`: A list of all brand categories.

    - **Raises**:
        - `HTTPException` (status code 400): If no brand categories are found.

    Example Request:
    ```http
    GET /products/brandcategories
    ```

    Example Successful Response:
    ```json
    [
        "Brand A",
        "Brand B",
        "Brand C"
    ]
    ```

    Example Error Response:
    ```json
    {
        "detail": "Brand Categories Not Found"
    }
    ```

    - **Notes**:
        - This endpoint is used to fetch all available brand categories in the system.
    """
    brand_categories = product_service.get_all_brand_categories(db)

    if not brand_categories:
        raise HTTPException(
            status_code=400,
            detail="Brand Categories Not Found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return brand_categories

@router.get("/get/partcategory")
def get_product_by_part_category_id(part_category_id: int, db: Session = Depends(get_db)):
    """
    Retrieve Products by Part Category ID

    This endpoint retrieves products based on their part category ID.

    - **Parameters**:
        - `part_category_id` (int): The ID of the part category to filter products by.
        - `db` (Session): A database session dependency for querying the products.

    - **Returns**:
        - `List[Product]`: A list of products within the specified part category.

    - **Raises**:
        - `HTTPException` (status code 400): If no products in the specified part category are found.

    Example Request:
    ```http
    GET /products/get/partcategory?part_category_id=1
    ```

    Example Successful Response:
    ```json
    [
        {
            "id": 1,
            "name": "Product A",
            "price": 100,
            "category": "Electronics"
        },
        ...
    ]
    ```

    Example Error Response:
    ```json
    {
        "detail": "No Products with that part type found"
    }
    ```

    - **Notes**:
        - If no products are found for the given part category, a 400 error will be returned with a relevant message.
    """
    products = product_service.get_products_by_part_category_id(db=db, part_category_id=part_category_id)

    if not products:
        raise HTTPException(
            status_code=400,
            detail="No Products with that part type found"
        )

    return products


@router.get("/get/brandcategory")
def get_product_by_brand_category_id(brand_category_id: int, db: Session = Depends(get_db)):
    """
    Retrieve Products by Brand Category ID

    This endpoint retrieves products based on their brand category ID.

    - **Parameters**:
        - `brand_category_id` (int): The ID of the brand category to filter products by.
        - `db` (Session): A database session dependency for querying the products.

    - **Returns**:
        - `List[Product]`: A list of products within the specified brand category.

    - **Raises**:
        - `HTTPException` (status code 400): If no products in the specified brand category are found.

    Example Request:
    ```http
    GET /products/get/brandcategory?brand_category_id=1
    ```

    Example Successful Response:
    ```json
    [
        {
            "id": 1,
            "name": "Product A",
            "price": 100,
            "category": "Electronics"
        },
        ...
    ]
    ```

    Example Error Response:
    ```json
    {
        "detail": "No Products with that brand found"
    }
    ```

    - **Notes**:
        - If no products are found for the given brand category, a 400 error will be returned with a relevant message.
    """
    products = product_service.get_products_by_brand_category_by_id(db=db, brand_category_id=brand_category_id)

    if not products:
        raise HTTPException(
            status_code=400,
            detail="No Products with that brand found"
        )

    return products
