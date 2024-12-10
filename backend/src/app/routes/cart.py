from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.cart import CartResponse, CartItemCreate, CartItemUpdate, Cart
from app.dependencies import get_db
from app.models.user import User
from app.core.auth import get_current_user
import app.services.cart as cart_service

router = APIRouter()


@router.get("/", response_model=Cart)
def get_cart_by_user_id(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve the Cart for the Current User

    This endpoint retrieves the shopping cart for the current authenticated user.
    If the user does not have an existing cart, a new cart is created.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Cart`: The cart object for the user, containing the list of items in the cart.

    Example Request:
    ```http
    GET /cart
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "items": [
            {
                "product_id": 101,
                "quantity": 2
            }
        ]
    }
    ```

    - **Notes**:
        - If no cart exists for the user, it will be automatically created.
    """
    cart = cart_service.get_or_create_cart(db=db, user_id=current_user.id)
    return cart

@router.get("/getTotalItems")
def get_total_number_of_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_items = cart_service.get_total_items_in_cart(user_id=current_user.id, db=db)
    return total_items

@router.post("/add", response_model=Cart)
def add_product_to_cart(item: CartItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Add a Product to the User's Cart

    This endpoint adds a product to the current authenticated user's shopping cart.
    If the product already exists in the cart, its quantity will be updated.

    - **Parameters**:
        - `item` (CartItemCreate): The product and quantity to be added to the cart.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Cart`: The updated cart object after the product has been added.

    Example Request:
    ```http
    POST /cart/add
    Content-Type: application/json

    {
        "product_id": 101,
        "quantity": 2
    }
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "items": [
            {
                "product_id": 101,
                "quantity": 2
            }
        ]
    }
    ```

    - **Notes**:
        - The cart is automatically created if it doesn't exist.
    """
    return cart_service.add_product_to_cart(db=db, item=item, user_id=current_user.id)



@router.put("/update")
def update_quantity(item: CartItemUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Update the Quantity of a Product in the Cart

    This endpoint updates the quantity of a product that is already in the user's cart.
    If the product is not in the cart, an error will be raised.

    - **Parameters**:
        - `item` (CartItemUpdate): The product ID and the new quantity to update in the cart.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Cart`: The updated cart object after the quantity has been changed.

    Example Request:
    ```http
    PUT /cart/update
    Content-Type: application/json

    {
        "product_id": 101,
        "quantity": 3
    }
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "items": [
            {
                "product_id": 101,
                "quantity": 3
            }
        ]
    }
    ```

    - **Notes**:
        - If the updated quantity is zero, the product will be removed from the cart.
    """
    return cart_service.update_cart_item_quantity(db=db, item=item, user_id=current_user.id)


@router.delete("/remove/{product_id}")
def remove_product(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Remove a Product from the Cart

    This endpoint removes a specific product from the user's cart using the product's ID.

    - **Parameters**:
        - `product_id` (int): The ID of the product to be removed from the cart.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Cart`: The updated cart object after the product has been removed.

    Example Request:
    ```http
    DELETE /cart/remove/101
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "items": []
    }
    ```

    - **Notes**:
        - If the product is not found in the cart, an error will be raised.
    """
    return cart_service.remove_product_from_cart(db=db, product_id=product_id, user_id=current_user.id)


@router.delete("/clear")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Clear All Products from the Cart

    This endpoint clears all products from the user's cart, leaving it empty.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message indicating the cart has been cleared.

    Example Request:
    ```http
    DELETE /cart/clear
    ```

    Example Successful Response:
    ```json
    {
        "message": "Cart successfully cleared"
    }
    ```

    - **Notes**:
        - This will remove all products from the cart for the current user.
    """
    return cart_service.clear_cart(db=db, user_id=current_user.id)
