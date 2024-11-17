from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_db

from app.models.user import User

import app.services.support as support_service
from app.schemas.support import SupportTicketBase
from datetime import UTC, datetime, timedelta


router = APIRouter()


@router.post("/ticket")
def create_support_ticket(ticket_creator: SupportTicketBase, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = support_service.create_support_ticket(support_ticket_creator=ticket_creator, user_id=current_user.id, db=db)
    return {"ticket": ticket}

@router.get("/ticket")
def get_support_ticket(ticket_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = support_service.get_support_ticket_by_id(support_ticket_id=ticket_id, user_id=current_user.id, db=db)
    return {"ticket": ticket}

@router.get("/ticket/all")
def get_all_user_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    all_tickets = support_service.get_all_support_tickets_by_user_id(user_id=current_user.id, db=db)
    return {"tickets": all_tickets}

@router.post("/ticket/reply")
def reply_to_ticket(ticket_id: int, reply: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    the_reply = support_service.reply_to_ticket(support_ticket_id=ticket_id, reply=reply, user_id=current_user.id,db=db)
    return the_reply


@router.post("/ticket/close")
def close_ticket(ticket_id: int, db: Session = Depends(get_db)):
    support_service.close_the_ticket(support_ticket_id=ticket_id, db=db)
    return {"message": f"Closed ticket with ID: {ticket_id}"}
