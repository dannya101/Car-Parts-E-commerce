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
    cart = cart_service.get_or_create_cart(db=db, user_id=current_user.id)
    return cart


@router.post("/add", response_model=Cart)
def add_product_to_cart(item: CartItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return cart_service.add_product_to_cart(db=db, item=item, user_id=current_user.id)



@router.put("/update")
def update_quantity(item: CartItemUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return cart_service.update_cart_item_quantity(db=db, item=item, user_id=current_user.id)


@router.delete("/remove/{product_id}")
def remove_product(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return cart_service.remove_product_from_cart(db=db, product_id=product_id, user_id=current_user.id)


@router.delete("/clear")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return cart_service.clear_cart(db=db, user_id=current_user.id)
