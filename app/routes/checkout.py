from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import app.services.checkout as checkout_service
import app.services.cart as cart_service
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user
from app.dependencies import get_db
from app.schemas.address import Address as AddressSchema
from app.models.user import User
from app.models.cart import Cart
from app.models.order import Order, OrderItem
from app.models.address import Address

router = APIRouter()


@router.post("/")
def start_checkout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Initiate the Checkout Process for the Current User

    This endpoint starts the checkout process for the current authenticated user.
    It clears the user's cart and begins creating an order.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `Cart`: The cart object, which has been cleared after checkout initiation.

    Example Request:
    ```http
    POST /checkout
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
        - The cart is automatically cleared after initiating checkout.
    """
    order = checkout_service.start_checkout(user_id=current_user.id, db=db)
    cart = cart_service.get_or_create_cart(db=db, user_id=current_user.id)
    cart_service.clear_cart(user_id=current_user.id, db=db)
    return cart

@router.get("/address/all")
def get_all_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve All Addresses Associated with the Current User

    This endpoint retrieves all the saved addresses for the current authenticated user.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `List[Address]`: A list of the user's saved addresses.

    Example Request:
    ```http
    GET /checkout/address/all
    ```

    Example Successful Response:
    ```json
    [
        {
            "id": 1,
            "user_id": 1,
            "address": "1234 Main St, Springfield, IL"
        }
    ]
    ```

    - **Notes**:
        - If no addresses are found, a `400` HTTPException is raised.
    """
    addresses = checkout_service.get_all_addressses(user_id=current_user.id, db=db)

    if not addresses:
        raise HTTPException(
            status_code=400,
            detail="No addresses found"
        )

    return addresses

@router.delete("/address")
def remove_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Remove a Saved Address for the Current User

    This endpoint allows the current authenticated user to remove a saved address by its ID.

    - **Parameters**:
        - `address_id` (int): The ID of the address to be removed.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message and the removed address object.

    Example Request:
    ```http
    DELETE /checkout/address?id=1
    ```

    Example Successful Response:
    ```json
    {
        "message": "Address Deleted",
        "address": {
            "id": 1,
            "user_id": 1,
            "address": "1234 Main St, Springfield, IL"
        }
    }
    ```

    - **Notes**:
        - If the address does not exist, a message indicating that the address is invalid will be returned.
    """
    getAddress = checkout_service.get_address_by_user_and_id(user_id=current_user.id, address_id=address_id, db=db)
    if getAddress is None:
        return {"message": "That is an invalid address"}
    checkout_service.delete_address(address_id=address_id, user_id=current_user.id, db=db)
    return {"message": "Address Deleted",
            "address" : getAddress}

@router.post("/address/setshipping")
def set_shipping_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Set the Shipping Address for the Current User

    This endpoint sets the shipping address for the current user by selecting a saved address.

    - **Parameters**:
        - `address_id` (int): The ID of the address to be set as the shipping address.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message and the selected address.

    Example Request:
    ```http
    POST /checkout/address/setshipping?id=1
    ```

    Example Successful Response:
    ```json
    {
        "message": "Set shipping address",
        "address": {
            "id": 1,
            "user_id": 1,
            "address": "1234 Main St, Springfield, IL"
        }
    }
    ```

    - **Notes**:
        - If the provided address ID is invalid, a message indicating the error is returned.
    """
    checkout_service.set_shipping_address(address_id=address_id, user_id=current_user.id, db=db)
    getAddress = checkout_service.get_address_by_user_and_id(user_id=current_user.id, address_id=address_id, db=db)
    if getAddress is None:
        return {"message": "That is an invalid address"}
    return {"message": "Set shipping address" ,
            "address" : {getAddress}}

@router.post("/address/setbilling")
def set_billing_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Set the Billing Address for the Current User

    This endpoint sets the billing address for the current user by selecting a saved address.

    - **Parameters**:
        - `address_id` (int): The ID of the address to be set as the billing address.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message and the selected address.

    Example Request:
    ```http
    POST /checkout/address/setbilling?id=1
    ```

    Example Successful Response:
    ```json
    {
        "message": "Set billing address",
        "address": {
            "id": 1,
            "user_id": 1,
            "address": "1234 Main St, Springfield, IL"
        }
    }
    ```

    - **Notes**:
        - If the provided address ID is invalid, a message indicating the error is returned.
    """
    checkout_service.set_billing_address(address_id=address_id, user_id=current_user.id, db=db)
    getAddress = checkout_service.get_address_by_user_and_id(user_id=current_user.id, address_id=address_id, db=db)
    if getAddress is None:
        return {"message": "That is an invalid address"}
    return {"message": "Set billing address",
            "address" : {getAddress}}

@router.post("/address")
def add_address(address: AddressSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Add a New Address for the Current User

    This endpoint allows the current authenticated user to add a new address to their profile.

    - **Parameters**:
        - `address` (AddressSchema): The new address to be added.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message and the updated order with the added address.

    Example Request:
    ```http
    POST /checkout/address
    Content-Type: application/json

    {
        "address": "1234 Main St, Springfield, IL"
    }
    ```

    Example Successful Response:
    ```json
    {
        "message": "Address added to order",
        "order": {
            "id": 1,
            "user_id": 1,
            "shipping_address": "1234 Main St, Springfield, IL"
        }
    }
    ```
    """
    order = checkout_service.add_address(address=address, user_id=current_user.id, db=db)
    return {"message": "Address added to order", "order": order}


@router.post("/shipping-method")
def select_shipping_method(
    shipping_method: str = Query(default="Regular Shipping(3-5 Days)",
        enum=["Regular Shipping(3-5 Days)", "Next Day Shipping(1-2 Days)",
        "Priority Shipping(1 Day)"]),
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Select the Shipping Method for the Order

    This endpoint allows the current user to select a shipping method for their order.

    - **Parameters**:
        - `shipping_method` (str): The shipping method selected by the user.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: The selected shipping method and the updated order.

    Example Request:
    ```http
    POST /checkout/shipping-method?shipping_method=Next Day Shipping(1-2 Days)
    ```

    Example Successful Response:
    ```json
    {
        "selected shipping method": "Next Day Shipping(1-2 Days)",
        "Order": {
            "id": 1,
            "user_id": 1,
            "shipping_method": "Next Day Shipping(1-2 Days)"
        }
    }
    """

    checkout_service.set_shipping_method(shipping_selected=shipping_method, user_id=current_user.id, db=db)
    getOrder = checkout_service.get_pending_order_from_db(user_id=current_user.id, db=db)
    return {"selected shipping method": shipping_method,
            "Order": getOrder}


@router.post("/payment-method")
def select_payment_method(payment_method: str = Query(default="Card",
                                                         enum=["Card", "Cashapp",
                                                            "Venmo"]),
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Select the Payment Method for the Order

    This endpoint allows the current user to select a payment method for their order.

    - **Parameters**:
        - `payment_method` (str): The payment method selected by the user.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: The selected payment method and the updated order.

    Example Request:
    ```http
    POST /checkout/payment-method?payment_method=Cashapp
    ```

    Example Successful Response:
    ```json
    {
        "selected payment method": "Cashapp",
        "Order": {
            "id": 1,
            "user_id": 1,
            "payment_method": "Cashapp"
        }
    }
    """

    checkout_service.set_payment_method(payment_selected=payment_method, user_id=current_user.id, db=db)
    getOrder = checkout_service.get_pending_order_from_db(user_id=current_user.id, db=db)
    return {"selected payment method": payment_method,
            "Order": getOrder}


@router.post("/complete")
def finalize_checkout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Complete the Checkout Process

    This endpoint finalizes the checkout process, completing the user's order.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A confirmation message and the completed order.

    Example Request:
    ```http
    POST /checkout/complete
    ```

    Example Successful Response:
    ```json
    {
        "message": "Checkout Complete",
        "order": {
            "id": 1,
            "user_id": 1,
            "status": "Completed"
        }
    }
    """
    order = checkout_service.finalize_checkout(user_id=current_user.id, db=db)
    return {"message": "Checkout Complete", "order": order}



@router.get("/order-summary")
def get_order_summary(order_id: int, db: Session = Depends(get_db)):
    """
    Retrieve the Order Summary for a Specific Order

    This endpoint provides the details of the order items in a given order.

    - **Parameters**:
        - `order_id` (int): The ID of the order to retrieve the summary for.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `List[OrderItem]`: A list of the items in the specified order.

    Example Request:
    ```http
    GET /checkout/order-summary?order_id=1
    ```

    Example Successful Response:
    ```json
    [
        {
            "product_id": 101,
            "quantity": 2
        }
    ]
    """
    return checkout_service.get_order_items_in_order(order_id=order_id, db=db)
