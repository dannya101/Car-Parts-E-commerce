from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.address import Address
from app.models.product import Product, PartCategory, BrandCategory
from app.models.support import SupportTicket, TicketReplies

#crud utility
def add_and_commit(db: Session, obj):
    """Add an object to the DB and commit."""
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def delete_and_commit(db: Session, obj):
    """Delete an object and commit."""
    db.delete(obj)
    db.commit()

def commit_and_refresh(db: Session, obj):
    db.commit()
    db.refresh(obj)
    return obj

#support crud
def get_ticket_by_id(db: Session, ticket_id: int):
    """Retrieve a support ticket by ID."""
    return db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()

def get_tickets_by_user_id(db: Session, user_id: int):
    """Retrieve all support tickets for a user."""
    return db.query(SupportTicket).filter(SupportTicket.user_id == user_id).all()

def get_ticket_replies_by_ticket_id(db: Session, ticket_id: int):
    """Retrieve all replies associated with a support ticket."""
    return db.query(TicketReplies).filter(TicketReplies.ticket_id == ticket_id).all()

#user crud
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

#product crud
def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_brand(db: Session, brand_category_id: int):
    return db.query(Product).filter(Product.brand_category_id == brand_category_id).first()

def get_product_by_part(db: Session, part_category_id: int):
    return db.query(Product).filter(Product.part_category_id == part_category_id).first()

def get_product_by_name(db: Session, name: int):
    return db.query(Product).filter(Product.name == name).first()

def get_all_products(db: Session):
    return db.query(Product).all()

def get_all_part_categories(db: Session):
    return db.query(PartCategory).all()

def get_all_brand_categories(db: Session):
    return db.query(BrandCategory).all()

#checkout crud
def get_cart_by_user_id(user_id: int, db: Session):
    return db.query(Cart).filter(Cart.user_id == user_id).first()

def get_cart_items_by_cart_id(cart_id: int, db: Session):
    return db.query(CartItem).filter(CartItem.cart_id == cart_id).all()

def add_order_item_to_db(order_item: OrderItem, db: Session):
    return add_and_commit(db, order_item)

def add_order_to_db(order: Order, db: Session):
    return add_and_commit(db, order)

def get_all_addressses(user_id: int, db: Session):
    addresses = db.query(Address).filter(Address.user_id == user_id).all()
    return addresses

def get_address_by_user_and_id(user_id: int, address_id: int, db: Session):
    return db.query(Address).filter(Address.user_id == user_id, Address.id == address_id).first()

def get_pending_order_from_db(user_id: int, db: Session):
    return db.query(Order).filter(Order.user_id == user_id, Order.status == "Pending").first()

def get_order_items_in_order(order_id: int, db: Session):
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

def get_all_user_orders(user_id: int, db: Session):
    return db.query(Order).filter(Order.user_id == user_id).all()

#cart crud
# Get a cart by user ID
def get_cart_by_user_id(user_id: int, db: Session):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

# Get cart items by cart ID
def get_cart_items_by_cart_id(cart_id: int, db: Session):
    return db.query(CartItem).filter(CartItem.cart_id == cart_id).all()

# Get a product by product ID
def get_product_by_id(product_id: int, db: Session):
    return db.query(Product).filter(Product.id == product_id).first()

# Get a cart item by cart ID and product ID
def get_cart_item_by_cart_and_product(cart_id: int, product_id: int, db: Session):
    return db.query(CartItem).filter(CartItem.cart_id == cart_id, CartItem.product_id == product_id).first()

# Add a new cart item to the database
def add_cart_item_to_db(cart_item: CartItem, db: Session):
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

# Update a cart item quantity in the database
def update_cart_item_quantity_in_db(cart_item: CartItem, quantity: int, db: Session):
    cart_item.quantity = quantity
    db.commit()
    db.refresh(cart_item)

# Delete a cart item from the database
def delete_cart_item_from_db(cart_item: CartItem, db: Session):
    db.delete(cart_item)
    db.commit()

# Delete all items from a cart
def clear_cart_items_in_db(cart_id: int, db: Session):
    db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
    db.commit()