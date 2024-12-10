from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_db

from app.models.user import User
from app.models.order import Order

import app.services.checkout as checkout_service

from app.crud import (
    get_order_by_id_crud
)


router = APIRouter()


@router.get("/")
def get_all_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve All Orders Associated with the Current User

    This endpoint fetches all orders placed by the current authenticated user along with the details of the items in each order.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A list of all orders made by the user in the field `order_content`, 
          with each order containing a list of its items.

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
                "total_price": 100.0,
                "items": [
                    {
                        "product_name": "Widget A",
                        "quantity": 2,
                        "price": 25.0
                    },
                    {
                        "product_name": "Widget B",
                        "quantity": 1,
                        "price": 50.0
                    }
                ]
            }
        ]
    }
    """
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()

    order_data = []
    for order in orders:
        items = [
            {
                "product_name": item.product.name,
                "product_thumbnail": item.product.thumbnail,
                "item_quantity": item.quantity,
                "item_price": item.price,
            }
            for item in order.items
        ]
        order_data.append({
            "id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "total_price": order.total_price,
            "items": items,
        })

    return {"order_content": order_data}


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
    order = get_order_by_id_crud(order_id, db)
    if order is None:
        raise HTTPException(status_code=400, detail="Order ID not valid")
    
    order_data = []

    items = [
        {
            "product_name": item.product.name,
            "product_thumbnail": item.product.thumbnail,
            "item_quantity": item.quantity,
            "item_price": item.price,
        }
        for item in order.items
    ]

    order_data.append({
        "id": order.id,
        "status": order.status,
        "total_price": order.total_price,
        "items": items
    })

    return order_data
