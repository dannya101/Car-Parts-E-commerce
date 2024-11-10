from sqlalchemy.orm import Session

from fastapi import HTTPException
from sqlalchemy import delete
from app.models.support import SupportTicket, TicketReplies
from app.schemas.support import SupportTicketBase


#CRUD
def get_all_support_tickets_by_user_id(user_id: int, db: Session):
    return db.query(SupportTicket).filter(SupportTicket.user_id == user_id).all()

def get_support_ticket_by_id(support_ticket_id: int, user_id: int, db: Session):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == support_ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {support_ticket_id} not valid")
    return ticket

def add_support_ticket_to_db(support_ticket: SupportTicket, db: Session):
    db.add(support_ticket)
    db.commit()
    db.refresh(support_ticket)

    return support_ticket

def create_support_ticket(support_ticket_creator: SupportTicketBase, user_id: int, db: Session):
    new_ticket = SupportTicket(
        user_id=user_id,
        title=support_ticket_creator.title,
        description=support_ticket_creator.description,
    )

    ticket = add_support_ticket_to_db(support_ticket=new_ticket, db=db)

    return ticket
def close_the_ticket(support_ticket_id: int, db: Session):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == support_ticket_id).first()
    print(f"theTicket {ticket}")
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {support_ticket_id} not valid")

    db.delete(ticket)
    db.commit()
    return f"Resolved ticket: {support_ticket_id}"