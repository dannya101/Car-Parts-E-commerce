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
    add_order_item_to_db,
    add_order_to_db,
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
    if order.billing_address and order.shipping_address:
        order.status = "Complete"
        return commit_and_refresh(db, order)
    else:
        raise HTTPException(status_code=400, detail="Order not ready for completion")

def set_order_address_in_db(address_new: Address, order: Order, db: Session):
    address_new = add_and_commit(db, address_new)

    if address_new.is_shipping:
        set_order_shipping_address_in_db(address_id=address_new.id, order=order, db=db)

    if address_new.is_billing:
        set_order_billing_address_in_db(address_id=address_new.id, order=order, db=db)

    return

def set_order_shipping_address_in_db(address_id: int, order: Order, db: Session):
    order.shipping_address_id = address_id
    return commit_and_refresh(db, order)

def set_order_billing_address_in_db(address_id: int, order: Order, db: Session):
    order.billing_address_id = address_id
    return commit_and_refresh(db, order)

def delete_address_from_db(address: Address, db: Session):
    delete_and_commit(db, address)
    return

def add_order_item_to_db(order_item: OrderItem, db: Session):
    return add_and_commit(db, order_item)

def add_order_to_db(order: Order, db: Session):
    return add_and_commit(db, order)

#create a new pending order with users cart as order items
def start_checkout(user_id: int, db: Session):
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
    address = get_address_by_user_and_id(user_id=user_id, address_id=address_id, db=db)

    if not address:
        raise HTTPException(status_code=400, detail="Could not find address with that id")

    delete_address_from_db(address=address, db=db)

    return

def set_shipping_address(address_id: int, user_id: int, db: Session):
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

    set_order_shipping_address_in_db(address_id=address_id, order=order, db=db)
    return

def set_billing_address(address_id: int, user_id: int, db: Session):
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

    set_order_billing_address_in_db(address_id=address_id, order=order, db=db)
    return

def set_shipping_method(shipping_selected: str, user_id: int, db: Session):
    return
def set_payment_method(payment_selected: str, user_id: int, db: Session):
    order = get_pending_order_from_db(user_id=user_id, db=db)
    order.payment_method = payment_selected 
    commit_and_refresh(db, order) 
    return

def add_address(address: AddressSchema, user_id: int, db: Session):
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

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

    set_order_address_in_db(address_new=address_new, order=order, db=db)

    return order

def finalize_checkout(user_id: int, db: Session):
    order = get_pending_order_from_db(user_id=user_id, db=db)

    if not order:
        raise HTTPException(status_code=400, detail="No pending order found")

    update_order_address_in_db(order=order, db=db)
    return order
