from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse

def get_products_from_cart(db: Session, cart: Cart):
    cart_items = db.query(CartItem).filter(CartItem.cart_id == Cart.id).all()

    products = []
    for item in cart_items:
        products.append(db.query(Product).filter(Product.id == item.product_id).first())

    return products

def get_or_create_cart(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart

def get_cart_by_user_id(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Not Found"
        )

    return cart

def add_product_to_cart(db: Session, item: CartItemCreate, user_id: int):
    cart = get_or_create_cart(db, user_id)

    product = db.query(Product).filter(Product.id == item.product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == item.product_id).first()
    if cart_item:
        cart_item.quantity += item.quantity
    else:

        new_item = CartItem(
            cart_id=cart.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price
            )

        db.add(new_item)

    db.commit()
    db.refresh(cart)

    return cart

def update_cart_item_quantity(db: Session, item: CartItemUpdate, user_id: int):
    cart_item = db.query(CartItem).filter(CartItem.product_id == item.product_id).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart Item Not Found")

    cart_item.quantity = item.quantity

    db.commit()
    db.refresh(cart_item)

    return cart_item.cart

def remove_product_from_cart(db: Session, product_id: int, user_id):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart Not Found")

    cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart Item Not Found")

    db.delete(cart_item)
    db.commit()

    return cart

def clear_cart(db: Session, user_id: int):
    cart = get_cart_by_user_id(db=db, user_id=user_id)

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Not Found"
        )

    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)

    return cart
