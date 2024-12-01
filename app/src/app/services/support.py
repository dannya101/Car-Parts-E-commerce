from sqlalchemy.orm import Session

from fastapi import HTTPException
from sqlalchemy import delete
from app.models.support import SupportTicket, TicketReplies
from app.schemas.support import SupportTicketBase
from app.crud import (
    add_and_commit,
    delete_and_commit,
    get_ticket_by_id,
    get_tickets_by_user_id,
    get_ticket_replies_by_ticket_id,
    get_all_tickets
)

def get_all_support_tickets_by_user_id(user_id: int, db: Session):
    """
    Fetch all support tickets created by a specific user.

    Parameters:
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        List[SupportTicket]: A list of tickets associated with the user.
    """
    return get_tickets_by_user_id(db, user_id)

def get_support_ticket_by_id(support_ticket_id: int, db: Session):
    """
    Retrieve a support ticket by its ID, ensuring it belongs to the user.

    Parameters:
        support_ticket_id (int): The ID of the support ticket.
        user_id (int): The ID of the user.
        db (Session): The database session.

    Returns:
        SupportTicket: The requested support ticket.

    Raises:
        HTTPException: If the ticket does not exist or does not belong to the user.
    """
    ticket = get_ticket_by_id(db, support_ticket_id)

    replies = get_ticket_replies_by_ticket_id(db=db, ticket_id=support_ticket_id)

    data = {
        "ticket": ticket,
        "replies": [
            {
                "ticket_id": reply.ticket_id,
                "content": reply.content,
                "id": reply.id,
                "user_name": reply.user_name,
                "created_at": reply.created_at,
            }
            for reply in replies
        ],
    }

    return data

def add_support_ticket_to_db(support_ticket: SupportTicket, db: Session):
    """
    Add a new support ticket to the database.

    Parameters:
        support_ticket (SupportTicket): The ticket to add.
        db (Session): The database session.

    Returns:
        SupportTicket: The newly created support ticket.
    """
    return add_and_commit(db, support_ticket)

def create_support_ticket(support_ticket_creator: SupportTicketBase, user_id: int, db: Session):
    """
    Create a new support ticket for the user.

    Parameters:
        support_ticket_creator (SupportTicketBase): Schema for the new ticket.
        user_id (int): The ID of the user creating the ticket.
        db (Session): The database session.

    Returns:
        SupportTicket: The newly created ticket.
    """
    new_ticket = SupportTicket(
        user_id=user_id,
        title=support_ticket_creator.title,
        description=support_ticket_creator.description,
    )

    ticket = add_support_ticket_to_db(support_ticket=new_ticket, db=db)

    return ticket

def close_the_ticket(support_ticket_id: int, db: Session):
    """
    Close a support ticket and delete all associated replies.

    Parameters:
        support_ticket_id (int): The ID of the ticket to close.
        db (Session): The database session.

    Returns:
        None

    Raises:
        HTTPException: If the ticket does not exist.
    """
    ticket = get_ticket_by_id(db, support_ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {support_ticket_id} not valid")

    reply_ticket = get_ticket_replies_by_ticket_id(db, support_ticket_id)
    for reply in reply_ticket:
        delete_and_commit(db, reply)
    delete_and_commit(db, ticket)
    return

def add_reply_to_db(admin_reply: TicketReplies, db: Session):
    """
    Add a reply to a support ticket.

    Parameters:
        admin_reply (TicketReplies): The reply to add.
        db (Session): The database session.

    Returns:
        TicketReplies: The added reply.
    """
    return add_and_commit(db, admin_reply)

def reply_to_ticket(support_ticket_id: int, reply: str, user_id: int, db:Session):
    """
    Add a reply to a specific support ticket.

    Parameters:
        support_ticket_id (int): The ID of the ticket to reply to.
        reply (str): The reply content.
        user_id (int): The ID of the user replying.
        db (Session): The database session.

    Returns:
        TicketReplies: The newly added reply.
    """
    new_reply = TicketReplies(ticket_id=support_ticket_id, user_id=user_id,content= reply)
    addedReply = add_reply_to_db(admin_reply=new_reply, db=db)

    data = {
        "id": new_reply.id,
        "ticket_id": new_reply.ticket_id,
        "content": new_reply.content,
        "user_name": new_reply.user.username,
        "created_at": new_reply.created_at
    }

    return data
