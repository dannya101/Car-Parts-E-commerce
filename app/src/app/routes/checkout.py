from fastapi import APIRouter, Depends, HTTPException
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
    order = checkout_service.start_checkout(user_id=current_user.id, db=db)
    cart_service.clear_cart(user_id=current_user.id, db=db)
    return order

@router.get("/address/all")
def get_all_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return checkout_service.get_all_addressses(user_id=current_user.id, db=db)

@router.delete("/address")
def remove_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    checkout_service.delete_address(address_id=address_id, user_id=current_user.id, db=db)
    return {"message": "Address Deleted"}

@router.post("/address/setshipping")
def set_shipping_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    checkout_service.set_shipping_address(address_id=address_id, user_id=current_user.id, db=db)
    return {"message": "Set shipping address"}

@router.post("/address/setbilling")
def set_billing_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    checkout_service.set_billing_address(address_id=address_id, user_id=current_user.id, db=db)
    return {"message": "Set billing address"}

@router.post("/address")
def add_address(address: AddressSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = checkout_service.add_address(address=address, user_id=current_user.id, db=db)
    return {"message": "Address added to order", "order": order}


@router.post("/shipping-method")
def select_shipping_method():
    pass


@router.post("/payment-method")
def select_payment_method():
    pass


@router.post("/complete")
def finalize_checkout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = checkout_service.finalize_checkout(user_id=current_user.id, db=db)
    return {"message": "Checkout Complete", "order": order}



@router.get("/order-summary")
def get_order_summary(order_id: int, db: Session = Depends(get_db)):
    return checkout_service.get_order_items_in_order(order_id=order_id, db=db)
