from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate
import json

from app.crud import (
    get_cart_by_user_id,
    get_cart_items_by_cart_id,
    get_product_by_id,
    get_cart_item_by_cart_and_product,
    add_cart_item_to_db,
    update_cart_item_quantity_in_db,
    delete_cart_item_from_db,
    clear_cart_items_in_db
)


# --- Helper Functions ---

def get_products_from_cart(db: Session, cart: Cart):
    """
    Retrieve all products and calculate the total price for a given cart.

    Parameters:
        db (Session): The database session.
        cart (Cart): The Cart object whose items are to be fetched.

    Returns:
        dict: A dictionary containing:
            - "items": A list of items with product details and quantities.
            - "total_price": The total price of all items in the cart.
    """
    cart_items = get_cart_items_by_cart_id(cart.id, db)
    items = []
    total_price = 0

    for item in cart_items:
        product = get_product_by_id(item.product_id, db)
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
                    "brand_category_id": product.brand_category_id,
                    "model_category_id": product.model_category_id
                },
                "quantity": item.quantity
            })

            total_price += product.price * item.quantity

    return {"items": items, "total_price": total_price}

# --- Cart Operations ---

def get_or_create_cart(db: Session, user_id: int):
    """
    Retrieve a user's cart. If the cart does not exist, create a new cart.

    Parameters:
        db (Session): The database session.
        user_id (int): The ID of the user.

    Returns:
        dict: A dictionary containing the cart's products and total price.
    """
    cart = get_cart_by_user_id(user_id=user_id, db=db)

    return get_products_from_cart(db=db, cart=cart)

def add_product_to_cart(db: Session, item: CartItemCreate, user_id: int):
    """
    Add a product to the user's cart. If the product already exists in the cart, update its quantity.

    Parameters:
        db (Session): The database session.
        item (CartItemCreate): The cart item details to be added (product_id, quantity).
        user_id (int): The ID of the user.

    Returns:
        dict: A dictionary containing the updated cart's products and total price.

    Raises:
        HTTPException: If the cart or product is not found.
    """
    cart = get_cart_by_user_id(user_id=user_id, db=db)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart Not Found")

    product = get_product_by_id(item.product_id, db=db)
    if not product:
        raise HTTPException(status_code=400, detail="Product Not Found")

    # Check if item is already in the cart
    cart_item = get_cart_item_by_cart_and_product(cart_id=cart.id, product_id=item.product_id, db=db)
    if cart_item:
        # Update quantity if the item is already in the cart
        update_cart_item_quantity_in_db(cart_item=cart_item, quantity=cart_item.quantity + item.quantity, db=db)
    else:
        # Add new item to cart
        new_cart_item = CartItem(cart_id=cart.id, product_id=item.product_id, quantity=item.quantity, price=product.price)
        add_cart_item_to_db(cart_item=new_cart_item, db=db)

    return get_products_from_cart(db=db, cart=cart)

def update_cart_item_quantity(db: Session, item: CartItemUpdate, user_id: int):
    """
    Update the quantity of an existing item in the user's cart.

    Parameters:
        db (Session): The database session.
        item (CartItemUpdate): The cart item details to be updated (product_id, new quantity).
        user_id (int): The ID of the user.

    Returns:
        dict: A dictionary containing the updated cart's products and total price.

    Raises:
        HTTPException: If the cart or cart item is not found.
    """
    cart = get_cart_by_user_id(user_id=user_id, db=db)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart Not Found")

    cart_item = get_cart_item_by_cart_and_product(cart_id=cart.id, product_id=item.product_id, db=db)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart Item Not Found")

    update_cart_item_quantity_in_db(cart_item=cart_item, quantity=item.quantity, db=db)
    return get_products_from_cart(db=db, cart=cart)

def remove_product_from_cart(db: Session, product_id: int, user_id: int):
    """
    Remove a specific product from the user's cart.

    Parameters:
        db (Session): The database session.
        product_id (int): The ID of the product to remove.
        user_id (int): The ID of the user.

    Returns:
        dict: A dictionary containing the updated cart's products and total price.

    Raises:
        HTTPException: If the cart or cart item is not found.
    """
    cart = get_cart_by_user_id(user_id=user_id, db=db)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart Not Found")

    cart_item = get_cart_item_by_cart_and_product(cart_id=cart.id, product_id=product_id, db=db)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart Item Not Found")

    delete_cart_item_from_db(cart_item=cart_item, db=db)
    return get_products_from_cart(db=db, cart=cart)

def clear_cart(db: Session, user_id: int):
    """
    Clear all items from the user's cart.

    Parameters:
        db (Session): The database session.
        user_id (int): The ID of the user.

    Returns:
        dict: A message indicating the cart has been cleared.

    Raises:
        HTTPException: If the cart is not found.
    """
    cart = get_cart_by_user_id(user_id=user_id, db=db)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart Not Found")

    clear_cart_items_in_db(cart_id=cart.id, db=db)
    return {"detail": "Cart Cleared"}
