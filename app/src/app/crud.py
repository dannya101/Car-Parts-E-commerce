from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.address import Address
from app.models.product import Product, PartCategory, BrandCategory, ModelCategory
from app.models.support import SupportTicket, TicketReplies

#CRUD Utility
def add_and_commit(db: Session, obj):
    """
    Add an object to the database session and commit the transaction.

    Parameters:
        db (Session): The database session.
        obj: The object to be added.

    Returns:
        The added and refreshed object.
    """
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def delete_and_commit(db: Session, obj):
    """
    Delete an object from the database session and commit the transaction.

    Parameters:
        db (Session): The database session.
        obj: The object to be deleted.
    """
    db.delete(obj)
    db.commit()

def commit_and_refresh(db: Session, obj):
    """
    Commit the current transaction and refresh the object from the database.

    Parameters:
        db (Session): The database session.
        obj: The object to be refreshed.

    Returns:
        The refreshed object.
    """
    db.commit()
    db.refresh(obj)
    return obj

#Support CRUD
def get_ticket_by_id(db: Session, ticket_id: int):
    """
    Retrieve a support ticket by its ID.

    Parameters:
        db (Session): The database session.
        ticket_id (int): The ID of the support ticket.

    Returns:
        The SupportTicket object or None if not found.
    """
    return db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()

def get_tickets_by_user_id(db: Session, user_id: int):
    """
    Retrieve all support tickets for a given user ID.

    Parameters:
        db (Session): The database session.
        user_id (int): The ID of the user.

    Returns:
        A list of SupportTicket objects.
    """
    return db.query(SupportTicket).filter(SupportTicket.user_id == user_id).all()

def get_ticket_replies_by_ticket_id(db: Session, ticket_id: int):
    """
    Retrieve all replies associated with a specific support ticket.

    Parameters:
        db (Session): The database session.
        ticket_id (int): The ID of the support ticket.

    Returns:
        A list of TicketReplies objects.
    """
    replies = db.query(
        TicketReplies.id,
        TicketReplies.ticket_id,
        TicketReplies.content,
        TicketReplies.created_at,
        User.username.label("user_name")
    ).join(
        User,
        TicketReplies.user_id == User.id
    ).filter(
        TicketReplies.ticket_id == ticket_id
    ).all()

    return replies

def get_all_tickets(db: Session):
    return db.query(SupportTicket).all()

#User CRUD
def get_user(db: Session, user_id: int):
    """
    Retrieve a user by their ID.

    Parameters:
        db (Session): The database session.
        user_id (int): The ID of the user.

    Returns:
        The User object or None if not found.
    """
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    """
    Retrieve a user by their username.

    Parameters:
        db (Session): The database session.
        username (str): The username of the user.

    Returns:
        The User object or None if not found.
    """
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    """
    Retrieve a user by their email address.

    Parameters:
        db (Session): The database session.
        email (str): The email address of the user.

    Returns:
        The User object or None if not found.
    """
    return db.query(User).filter(User.email == email).first()

def set_admin(db:Session, user_id: int):
    user = get_user(db=db, user_id=user_id)
    user.is_admin = True

    commit_and_refresh(db=db, obj=user)
    return user


#Product CRUD
def get_product_by_id(db: Session, product_id: int):
    """
    Retrieve a product by its ID.

    Parameters:
        db (Session): The database session.
        product_id (int): The ID of the product.

    Returns:
        The Product object or None if not found.
    """
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_brand(db: Session, brand_category_id: int):
    """
    Retrieve a product by its brand category ID.

    Parameters:
        db (Session): The database session.
        brand_category_id (int): The ID of the brand category.

    Returns:
        The Product object or None if not found.
    """
    return db.query(Product).filter(Product.brand_category_id == brand_category_id).first()

def get_product_by_part(db: Session, part_category_id: int):
    """
    Retrieve a product by its part category ID.

    Parameters:
        db (Session): The database session.
        part_category_id (int): The ID of the part category.

    Returns:
        The Product object or None if not found.
    """
    return db.query(Product).filter(Product.part_category_id == part_category_id).first()

def get_product_by_name(db: Session, name: int):
    """
    Retrieve a product by its name.

    Parameters:
        db (Session): The database session.
        name (str): The name of the product.

    Returns:
        The Product object or None if not found.
    """
    return db.query(Product).filter(Product.name == name).first()

def get_all_products(db: Session):
    """
    Retrieve all products from the database.

    Parameters:
        db (Session): The database session.

    Returns:
        A list of Product objects.
    """
    return db.query(Product).all()

def get_all_part_categories(db: Session):
    """
    Retrieve all part categories from the database.

    Parameters:
        db (Session): The database session.

    Returns:
        A list of PartCategory objects.
    """
    return db.query(PartCategory).all()

def get_all_brand_categories(db: Session):
    """
    Retrieve all brand categories from the database.

    Parameters:
        db (Session): The database session.

    Returns:
        A list of BrandCategory objects.
    """
    return db.query(BrandCategory).all()

def get_all_model_categories(db: Session):
    return db.query(ModelCategory).all()

def get_model_categories_by_brand_id(db: Session, brand_category_id: int):
    return db.query(ModelCategory).join(BrandCategory, ModelCategory.brand_id == BrandCategory.id).filter(BrandCategory.id == brand_category_id).all()

def get_part_category_by_name(db: Session, name: str):
    """
    Retrieve a part category by its name.

    Parameters:
        db (Session): The database session.
        name (str): The name of the part category.

    Returns:
        The PartCategory object or None if not found.
    """
    return db.query(PartCategory).filter(PartCategory.part_type_name == name).first()

def get_brand_category_by_name(db: Session, name: str):
    """
    Retrieve a brand category by its name.

    Parameters:
        db (Session): The database session.
        name (str): The name of the brand category.

    Returns:
        The BrandCategory object or None if not found.
    """
    return db.query(BrandCategory).filter(BrandCategory.brand_type_name == name).first()

def get_model_category_by_name(db: Session, name: str):
    return db.query(ModelCategory).filter(ModelCategory.model_name == name).first()

def get_products_by_part_category_id(db: Session, part_category_id: int):
    """
    Retrieve a product by its part category id.

    Parameters:
        db (Session): The database session.
        part_category_id (int): The id of the part category.

    Returns:
        Product objects or None if not found.
    """
    return db.query(Product).filter(Product.part_category_id == part_category_id).all()

def get_products_by_brand_category_by_id(db: Session, brand_category_id: int):
    """
    Retrieve a product by its brand category id.

    Parameters:
        db (Session): The database session.
        brand_category_id (int): The id of the brand category.

    Returns:
        Product object or None if not found.
    """
    return db.query(Product).filter(Product.brand_category_id == brand_category_id).all()

def get_products_by_brand_and_model(db: Session, brand_category_id: int, model_category_id: int):
    return db.query(Product).filter(Product.brand_category_id == brand_category_id and Product.model_category_id == model_category_id).all()

#Checkout CRUD
def get_cart_by_user_id(user_id: int, db: Session):
    """
    Retrieve the cart associated with a user ID.

    Parameters:
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        Cart: The Cart object if found, otherwise None.
    """
    return db.query(Cart).filter(Cart.user_id == user_id).first()

def get_cart_items_by_cart_id(cart_id: int, db: Session):
    """
    Retrieve all items associated with a specific cart ID.

    Parameters:
        cart_id (int): The ID of the cart.
        db (Session): The database session.

    Returns:
        list[CartItem]: A list of CartItem objects associated with the cart.
    """
    return db.query(CartItem).filter(CartItem.cart_id == cart_id).all()

def get_all_addressses(user_id: int, db: Session):
    """
    Retrieve all addresses associated with a user ID.

    Parameters:
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        list[Address]: A list of Address objects associated with the user.
    """
    addresses = db.query(Address).filter(Address.user_id == user_id).all()
    return addresses

def get_address_by_user_and_id(user_id: int, address_id: int, db: Session):
    """
    Retrieve a specific address for a user by its address ID.

    Parameters:
        user_id (int): The ID of the user.
        address_id (int): The ID of the address.
        db (Session): The database session.

    Returns:
        Address: The Address object if found, otherwise None.
    """
    return db.query(Address).filter(Address.user_id == user_id, Address.id == address_id).first()

def get_pending_order_from_db(user_id: int, db: Session):
    """
    Retrieve the pending order for a specific user.

    Parameters:
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        Order: The pending Order object if found, otherwise None.
    """

    return db.query(Order).filter(Order.user_id == user_id, Order.status == "Pending").first()

def get_order_items_in_order(order_id: int, db: Session):
    """
    Retrieve all items associated with a specific order.

    Parameters:
        order_id (int): The ID of the order.
        db (Session): The database session.

    Returns:
        list[OrderItem]: A list of OrderItem objects associated with the order.
    """
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

def get_all_user_orders(user_id: int, db: Session):
    """
    Retrieve all orders associated with a specific user ID.

    Parameters:
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        list[Order]: A list of Order objects associated with the user.
    """

    return db.query(Order).filter(Order.user_id == user_id).all()

#Cart CRUD
def get_cart_by_user_id(user_id: int, db: Session):
    """
    Retrieve the cart for a specific user ID. If the cart does not exist, create one.

    Parameters:
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        Cart: The Cart object.
    """
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def get_cart_items_by_cart_id(cart_id: int, db: Session):
    """
    Retrieve all items in a specific cart.

    Parameters:
        cart_id (int): The ID of the cart.
        db (Session): The database session.

    Returns:
        list[CartItem]: A list of CartItem objects in the cart.
    """
    return db.query(CartItem).filter(CartItem.cart_id == cart_id).all()

def get_product_by_id(product_id: int, db: Session):
    """
    Retrieve a product by its ID.

    Parameters:
        product_id (int): The ID of the product.
        db (Session): The database session.

    Returns:
        Product: The Product object if found, otherwise None.
    """
    return db.query(Product).filter(Product.id == product_id).first()

def get_cart_item_by_cart_and_product(cart_id: int, product_id: int, db: Session):
    """
    Retrieve a cart item by cart ID and product ID.

    Parameters:
        cart_id (int): The ID of the cart.
        product_id (int): The ID of the product.
        db (Session): The database session.

    Returns:
        CartItem: The CartItem object if found, otherwise None.
    """
    return db.query(CartItem).filter(CartItem.cart_id == cart_id, CartItem.product_id == product_id).first()

def add_cart_item_to_db(cart_item: CartItem, db: Session):
    """
    Add a new item to the cart and commit the transaction.

    Parameters:
        cart_item (CartItem): The CartItem object to add.
        db (Session): The database session.

    Returns:
        CartItem: The added and refreshed CartItem object.
    """
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

def update_cart_item_quantity_in_db(cart_item: CartItem, quantity: int, db: Session):
    """
    Update the quantity of a specific item in the cart.

    Parameters:
        cart_item (CartItem): The CartItem object to update.
        quantity (int): The new quantity to set.
        db (Session): The database session.

    Returns:
        None
    """
    cart_item.quantity = quantity
    db.commit()
    db.refresh(cart_item)

def delete_cart_item_from_db(cart_item: CartItem, db: Session):
    """
    Remove an item from the cart and commit the transaction.

    Parameters:
        cart_item (CartItem): The CartItem object to delete.
        db (Session): The database session.

    Returns:
        None
    """
    db.delete(cart_item)
    db.commit()

def clear_cart_items_in_db(cart_id: int, db: Session):
    """
    Remove all items from a specific cart.

    Parameters:
        cart_id (int): The ID of the cart.
        db (Session): The database session.

    Returns:
        None
    """
    db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
    db.commit()

#Order CRUD
def get_order_by_id_crud(order_id: int, db: Session):
    """
    Retrieve an Order by Its ID.

    - **Parameters**:
        - `order_id` (int): The ID of the order to retrieve.
        - `db` (Session): The database session to use.

    - **Returns**:
        - `Order`: The order object corresponding to the provided order ID, or `None` if not found.
    """
    return db.query(Order).filter(Order.id == order_id).first()

def search_products_given_make(make_id: int, search_terms: str, db: Session):
    """
    Search for products by brand ID and name containing search terms.

    :param make_id: The ID of the brand.
    :param search_terms: The search keywords to look for in product names.
    :param db: The database session.
    :return: A list of products matching the criteria.
    """
    search_query = f"%{search_terms}%"  # Prepare the search pattern
    products = (
        db.query(Product)
        .filter(
            and_(
                Product.brand_category_id == make_id,  # Filter by brand ID
                Product.name.ilike(search_query)  # Case-insensitive search for name
            )
        )
        .all()
    )
    return products
