from fastapi import APIRouter, Depends,HTTPException, Query

from sqlalchemy.orm import Session

import app.services.product as product_services
from app.dependencies import get_db

router = APIRouter()


@router.get("/{search_terms}")
def get_products_from_search(search_terms: str, db: Session = Depends(get_db)):
    """
    Search for Products by Name

    This endpoint allows users to search for products based on the provided search terms. It queries the product name
    to find matching products.

    - **Parameters**:
        - `search_terms` (str): The search string to query product names.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `List[Product]`: A list of products matching the search terms.

    - **Raises**:
        - `HTTPException`: If no products are found with the search terms, a `400` HTTPException is raised.

    Example Request:
    ```http
    GET /products/laptop
    ```

    Example Successful Response:
    ```json
    [
        {
            "id": 1,
            "name": "Laptop",
            "price": 999.99,
            "category": "Electronics"
        }
    ]
    ```

    Example Error Response:
    ```json
    {
        "detail": "No Product Found!"
    }
    """
    result = product_services.get_product_by_name(db=db, name=search_terms)
    if result is None:
        raise HTTPException(
            status_code=400,
            detail="No Product Found!"
        )
    return result

@router.get("/make")
def get_products_from_search_by_make(make_id: int = Query(...), search_terms: str = Query(...), db: Session = Depends(get_db)):
    result = product_services.search_products_given_make(make_id=make_id, search_terms=search_terms, db=db)

    return result
