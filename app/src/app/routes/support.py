from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_db

from app.models.user import User

import app.services.support as support_service
from app.schemas.support import SupportTicketBase
from datetime import UTC, datetime, timedelta


router = APIRouter()


@router.post("/ticket")
def create_support_ticket(support_ticket_creator: SupportTicketBase, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = support_service.create_support_ticket(support_ticket_creator=support_ticket_creator, user_id=current_user.id, db=db)
    return ticket

@router.get("/ticket")
def get_support_ticket(support_ticket_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return support_service.get_support_ticket_by_id(support_ticket_id=support_ticket_id, user_id=current_user.id, db=db)

@router.get("/ticket/all")
def get_all_user_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return support_service.get_all_support_tickets_by_user_id(user_id=current_user.id, db=db)

@router.post("/ticket/reply")
def reply_to_ticket():
    pass


@router.post("/ticket/close")
def close_ticket():
    pass
