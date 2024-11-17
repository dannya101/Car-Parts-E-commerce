from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_db

from app.models.user import User
from app.models.order import Order

import app.services.checkout as checkout_service


router = APIRouter()


@router.get("/")
def get_all_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve All Orders Associated with the Current User

    This endpoint fetches all orders placed by the current authenticated user.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A list of all orders made by the user in the field `order_content`.

    Example Request:
    ```http
    GET /orders
    ```

    Example Successful Response:
    ```json
    {
        "order_content": [
            {
                "id": 1,
                "user_id": 1,
                "status": "Completed",
                "total_price": 100.0
            }
        ]
    }
    """
    orders = checkout_service.get_all_user_orders(user_id=current_user.id, db=db)
    return {"order_content": orders}


@router.get("/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    """
    Retrieve an Order by Its ID

    This endpoint allows retrieval of an individual order by its unique order ID.

    - **Parameters**:
        - `order_id` (int): The ID of the order to retrieve.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Order`: The order object corresponding to the provided order ID.

    - **Raises**:
        - `HTTPException`: If no order is found with the provided ID, a `400` HTTPException is raised with a detail message.

    Example Request:
    ```http
    GET /orders/1
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "status": "Completed",
        "total_price": 100.0
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Order ID not valid"
    }
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=400, detail="Order ID not valid")
    return order
