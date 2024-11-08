from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse

import json

#Turn a Cart object into a list of items with product, quantity, and total_price
def get_products_from_cart(db: Session, cart: Cart):
    cart_items = db.query(CartItem).filter(CartItem.cart_id == Cart.id).all()

    items = []
    total_price = 0
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:

            tags = json.loads(product.tags) if isinstance(product.tags, str) else product.tags
            images = json.loads(product.images) if isinstance(product.images, str) else product.images

            items.append({
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": product.price,
                    "tags": tags,
                    "images": images,
                    "thumbnail": product.thumbnail,
                    "part_category_id": product.part_category_id,
                    "brand_category_id": product.brand_category_id
                },
                "quantity": item.quantity
            })

            total_price += product.price * item.quantity

    return {"items": items, "total_price": total_price}

#Get cart from DB and return the items within it
def get_or_create_cart(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_data = get_products_from_cart(db=db, cart=cart)

    return cart_data

#Get Cart object from user_id
def get_cart_by_user_id(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Not Found"
        )

    return cart

#Add a product to the cart respond with items in cart
def add_product_to_cart(db: Session, item: CartItemCreate, user_id: int):
    cart = get_cart_by_user_id(db, user_id)

    product = db.query(Product).filter(Product.id == item.product_id).first()

    #Raise 400 Exception when product is not found
    if not product:
        raise HTTPException(
            status_code=400,
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
        db.flush()

    db.commit()
    if cart_item:
        db.refresh(cart_item)
    else:
        db.refresh(new_item)
    db.refresh(cart)

    cart_data = get_products_from_cart(db=db, cart=cart)


    return cart_data

#Update the quantity value of a product in cart responds with items list
def update_cart_item_quantity(db: Session, item: CartItemUpdate, user_id: int):
    cart_item = db.query(CartItem).filter(CartItem.product_id == item.product_id).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart Item Not Found")

    cart_item.quantity = item.quantity

    db.commit()
    db.refresh(cart_item)

    cart_data = get_products_from_cart(db=db, cart=cart_item.cart)

    return cart_data

#Remove a product from the cart responds with items list
def remove_product_from_cart(db: Session, product_id: int, user_id):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart Not Found")

    cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart Item Not Found")

    db.delete(cart_item)
    db.commit()

    cart_data = get_products_from_cart(db=db, cart=cart)

    return cart_data

#Clear all items from the cart
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

    cart_data = get_products_from_cart(db=db, cart=cart)

    return {"detail": "Cart Cleared"}
