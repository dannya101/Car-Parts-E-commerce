from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.address import Address
from app.models.product import Product, PartCategory, BrandCategory
from app.models.support import SupportTicket, TicketReplies

#support crud
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

def get_ticket_by_id(db: Session, ticket_id: int):
    """Retrieve a support ticket by ID."""
    return db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()

def get_tickets_by_user_id(db: Session, user_id: int):
    """Retrieve all support tickets for a user."""
    return db.query(SupportTicket).filter(SupportTicket.user_id == user_id).all()

def get_ticket_replies_by_ticket_id(db: Session, ticket_id: int):
    """Retrieve all replies associated with a support ticket."""
    return db.query(TicketReplies).filter(TicketReplies.ticket_id == ticket_id).all()