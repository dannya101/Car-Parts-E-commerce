from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_db

from app.models.user import User
from app.models.order import Order

import app.services.checkout as checkout_service


router = APIRouter()


@router.get("/")
def get_all_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = checkout_service.get_all_user_orders(user_id=current_user.id, db=db)
    # order_content = []
    # for order in orders:
    #     order_content.append(checkout_service.get_order_items_in_order(order_id=order.id, db=db))

    return {"order_content": orders}


@router.get("/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=400, detail="Order ID not valid")
    return order
