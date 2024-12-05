from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import get_settings

from app.schemas.address import Address as AddressSchema

from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.address import Address

from app.crud import (
    get_cart_by_user_id,
    get_cart_items_by_cart_id,
    get_all_addressses,
    get_address_by_user_and_id,
    get_pending_order_from_db,
    get_order_items_in_order,
    get_all_user_orders,
    commit_and_refresh,
    add_and_commit,
    delete_and_commit
)


def update_order_address_in_db(order: Order, db: Session):
    """
    Marks an order as 'Complete' if it has both billing and shipping addresses.

    Parameters:
        order (Order): The order to update.
        db (Session): The database session.

    Returns:
        Order: The updated order.

    Raises:
        HTTPException: If the order is not ready for completion.
    """
    if order.billing_address and order.shipping_address:
        order.status = "Complete"
        return commit_and_refresh(db, order)
    else:
        raise HTTPException(status_code=400, detail="Order not ready for completion")

def set_order_address_in_db(address_new: Address, order: Order, db: Session):
    """
    Adds a new address and associates it with an order as either billing or shipping.

    Parameters:
        address_new (Address): The new address to add.
        order (Order): The order to associate the address with.
        db (Session): The database session.
    """
    address_new = add_and_commit(db, address_new)

    if address_new.is_shipping:
        set_order_shipping_address_in_db(address_id=address_new.id, order=order, db=db)

    if address_new.is_billing:
        set_order_billing_address_in_db(address_id=address_new.id, order=order, db=db)

    return

def set_order_shipping_address_in_db(address_id: int, order: Order, db: Session):
    """
    Sets the shipping address for an order.

    Parameters:
        address_id (int): The ID of the shipping address.
        order (Order): The order to update.
        db (Session): The database session.

    Returns:
        Order: The updated order.
    """
    order.shipping_address_id = address_id
    return commit_and_refresh(db, order)

def set_order_billing_address_in_db(address_id: int, order: Order, db: Session):
    """
    Sets the billing address for an order.

    Parameters:
        address_id (int): The ID of the billing address.
        order (Order): The order to update.
        db (Session): The database session.

    Returns:
        Order: The updated order.
    """
    order.billing_address_id = address_id
    return commit_and_refresh(db, order)

def delete_address_from_db(address: Address, db: Session):
    """
    Deletes an address from the database.

    Parameters:
        address (Address): The address to delete.
        db (Session): The database session.
    """

    delete_and_commit(db, address)
    return

def add_order_item_to_db(order_item: OrderItem, db: Session):
    """
    Adds an order item to the database.

    Parameters:
        order_item (OrderItem): The order item to add.
        db (Session): The database session.

    Returns:
        OrderItem: The added order item.
    """
    return add_and_commit(db, order_item)

def add_order_to_db(order: Order, db: Session):
    """
    Adds an order to the database.

    Parameters:
        order (Order): The order to add.
        db (Session): The database session.

    Returns:
        Order: The added order.
    """

    return add_and_commit(db, order)

def start_checkout(user_id: int, db: Session):
    """
    Creates a new pending order using the user's cart as order items.

    Parameters:
        user_id (int): The user's ID.
        db (Session): The database session.

    Returns:
        Order: The newly created order.

    Raises:
        HTTPException: If the cart is empty or does not exist.
    """
    cart = get_cart_by_user_id(user_id=user_id, db=db)

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty or does not exist")

    total_price = sum(item.quantity * item.product.price for item in cart.items)

    order = Order(user_id=user_id, cart_id=cart.id, shipping_method="Regular Shipping(3-5 Days)", payment_method="Card", status="Pending", total_price=total_price)
    add_order_to_db(order=order, db=db)

    cart_items = get_cart_items_by_cart_id(cart_id=cart.id, db=db)

    for item in cart_items:
        new_order_item = OrderItem(order_id=order.id, product_id=item.product_id, quantity=item.quantity, price=item.price)
        add_order_item_to_db(new_order_item, db)

    return order

def delete_address(address_id: int, user_id: int, db: Session):
    """
    Deletes a user's address by ID.

    Parameters:
        address_id (int): The address ID.
        user_id (int): The user ID.
        db (Session): The database session.

    Raises:
        HTTPException: If the address is not found.
    """
    address = get_address_by_user_and_id(user_id=user_id, address_id=address_id, db=db)

    if not address:
        raise HTTPException(status_code=400, detail="Could not find address with that id")

    delete_address_from_db(address=address, db=db)

    return

def set_shipping_address(address_id: int, user_id: int, db: Session):
    """
    Sets the shipping address for a user's pending order.

    Parameters:
        address_id (int): The address ID.
        user_id (int): The user ID.
        db (Session): The database session.

    Raises:
        HTTPException: If no pending order is found.
    """
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

    set_order_shipping_address_in_db(address_id=address_id, order=order, db=db)
    return

def set_billing_address(address_id: int, user_id: int, db: Session):
    """
    Sets the billing address for a user's pending order.

    Parameters:
        address_id (int): The address ID.
        user_id (int): The user ID.
        db (Session): The database session.

    Raises:
        HTTPException: If no pending order is found.
    """
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

    set_order_billing_address_in_db(address_id=address_id, order=order, db=db)
    return

def set_shipping_method(shipping_selected: str, user_id: int, db: Session):
    """
    Updates the shipping method for a user's pending order.

    Parameters:
        shipping_selected (str): The selected shipping method.
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        None

    Raises:
        HTTPException: If no pending order is found.
    """
    order = get_pending_order_from_db(user_id=user_id, db=db)
    order.shipping_method = shipping_selected 
    commit_and_refresh(db, order) 
    return

def set_payment_method(payment_selected: str, user_id: int, db: Session):
    """
    Updates the payment method for a user's pending order.

    Parameters:
        payment_selected (str): The selected payment method.
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        None

    Raises:
        HTTPException: If no pending order is found.
    """
    order = get_pending_order_from_db(user_id=user_id, db=db)
    order.payment_method = payment_selected 
    commit_and_refresh(db, order) 
    return

def add_address(address: AddressSchema, user_id: int, db: Session):
    """
    Adds a new address to the user's profile and associates it with the user's pending order.

    Parameters:
        address (AddressSchema): The address schema containing the address details.
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        Order: The updated order with the new address.

    Raises:
        HTTPException: If no pending order is found.
    """

    address_new = Address(
        user_id=user_id,
        street_address=address.street_address,
        city=address.city,
        state=address.state,
        postal_code=address.postal_code,
        country=address.country,
        is_billing=address.is_billing,
        is_shipping=address.is_shipping
    )

    add_and_commit(db=db, obj=address_new)

    return address_new

def finalize_checkout(user_id: int, db: Session):
    """
    Completes the checkout process by finalizing the pending order.

    Parameters:
        user_id (int): The user ID.
        db (Session): The database session.

    Returns:
        Order: The finalized order.

    Raises:
        HTTPException: If no pending order is found.
    """
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

    update_order_address_in_db(order=order, db=db)
    return order
