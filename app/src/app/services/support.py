from sqlalchemy.orm import Session

from fastapi import HTTPException
from sqlalchemy import delete
from app.models.support import SupportTicket, TicketReplies
# from app.models.support import SupportTicket
from app.schemas.support import SupportTicketBase


#CRUD
def add_and_commit(db: Session, obj):
    """Add an object to the DB and commit."""
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def commit_and_refresh(db: Session, obj):
    """Commit and refresh an object."""
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


#get all support tickets
def get_all_support_tickets_by_user_id(user_id: int, db: Session):
    return get_tickets_by_user_id(db, user_id)

def get_support_ticket_by_id(support_ticket_id: int, user_id: int, db: Session):
    ticket = get_ticket_by_id(db, support_ticket_id)
    if not ticket or ticket.user_id != user_id:
        raise HTTPException(status_code=404, detail=f"Ticket {support_ticket_id} not valid")
    return ticket

def add_support_ticket_to_db(support_ticket: SupportTicket, db: Session):
    return add_and_commit(db, support_ticket)

def create_support_ticket(support_ticket_creator: SupportTicketBase, user_id: int, db: Session):
    new_ticket = SupportTicket(
        user_id=user_id,
        title=support_ticket_creator.title,
        description=support_ticket_creator.description,
    )

    ticket = add_support_ticket_to_db(support_ticket=new_ticket, db=db)

    return ticket

def close_the_ticket(support_ticket_id: int, db: Session):
    ticket = get_ticket_by_id(db, support_ticket_id)
    print(f"theTicket {ticket}")
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {support_ticket_id} not valid")

    reply_ticket = get_ticket_replies_by_ticket_id(db, support_ticket_id)
    for reply in reply_ticket:
        delete_and_commit(db, reply)
    delete_and_commit(db, ticket)
    return f"Resolved ticket with id of {support_ticket_id}"

def add_reply_to_db(admin_reply: TicketReplies, db: Session):
    return add_and_commit(db, admin_reply)

def reply_to_ticket(support_ticket_id: int, reply: str, user_id: int, db:Session):
    new_reply = TicketReplies(ticket_id=support_ticket_id, user_id=user_id,content= reply)
    addedReply = add_reply_to_db(admin_reply=new_reply, db=db)
    # db.query(SupportTicket).filter(SupportTicket.id == support_ticket_id).update({'ticket_reply_content': reply})
    # db.commit()
    return addedReply