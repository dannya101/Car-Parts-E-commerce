from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_db

from app.models.user import User
from app.models.order import Order


router = APIRouter()


@router.get("/{user_id}")
def get_all_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()

    return orders


@router.get("/{order_id}")
def get_order_by_id(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.user_id == current_user.id).first()

    return order
