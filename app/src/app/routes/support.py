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
    """
    Create a New Support Ticket

    This endpoint allows the authenticated user to create a new support ticket. The ticket is created with the provided details
    such as the issue description and other relevant information.

    - **Parameters**:
        - `ticket_creator` (SupportTicketBase): The data for the new support ticket, including the issue description and any other details.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency to interact with the database.

    - **Returns**:
        - `dict`: The created support ticket, including its ID, status, and other relevant details.

    Example Request:
    ```http
    POST /ticket
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "subject": "Issue with product",
        "status": "Open",
        "created_at": "2024-11-17T12:00:00"
    }
    """
    ticket = support_service.create_support_ticket(support_ticket_creator=ticket_creator, user_id=current_user.id, db=db)
    return ticket

@router.get("/ticket")
def get_support_ticket(ticket_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve a Support Ticket by its ID

    This endpoint retrieves a specific support ticket for the authenticated user by the provided ticket ID.

    - **Parameters**:
        - `ticket_id` (int): The ID of the support ticket to retrieve.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency to interact with the database.

    - **Returns**:
        - `dict`: The support ticket details corresponding to the provided ticket ID.

    Example Request:
    ```http
    GET /ticket?ticket_id=1
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "subject": "Issue with product",
        "status": "Open"
    }
    """
    ticket = support_service.get_support_ticket_by_id(support_ticket_id=ticket_id, user_id=current_user.id, db=db)
    return ticket

@router.get("/ticket/all")
def get_all_user_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve All Support Tickets for the Authenticated User

    This endpoint retrieves all support tickets created by the authenticated user.

    - **Parameters**:
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency to interact with the database.

    - **Returns**:
        - `list`: A list of all support tickets created by the user, including their status and subject.

    Example Request:
    ```http
    GET /ticket/all
    ```

    Example Successful Response:
    ```json
    {
        "tickets": [
            {
                "id": 1,
                "user_id": 1,
                "subject": "Issue with product",
                "status": "Open"
            },
            {
                "id": 2,
                "user_id": 1,
                "subject": "Billing question",
                "status": "Closed"
            }
        ]
    }
    """
    all_tickets = support_service.get_all_support_tickets_by_user_id(user_id=current_user.id, db=db)
    return {"tickets": all_tickets}

@router.post("/ticket/reply")
def reply_to_ticket(ticket_id: int, reply: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Reply to a Support Ticket

    This endpoint allows the current user to reply to an existing support ticket.

    - **Parameters**:
        - `ticket_id` (int): The ID of the support ticket to reply to.
        - `reply` (str): The reply message to be added to the ticket.
        - `current_user` (User): The currently authenticated user, injected by the `get_current_user` dependency.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `str`: The reply added to the support ticket.

    Example Request:
    ```http
    POST /ticket/reply
    ```

    Example Successful Response:
    ```json
    {
        "reply": "We are looking into your issue and will get back to you soon."
    }
    """
    the_reply = support_service.reply_to_ticket(support_ticket_id=ticket_id, reply=reply, user_id=current_user.id,db=db)
    return the_reply


@router.post("/ticket/close")
def close_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    Close a Support Ticket

    This endpoint closes an open support ticket using the provided ticket ID.

    - **Parameters**:
        - `ticket_id` (int): The ID of the support ticket to close.
        - `db` (Session): A database session dependency for interacting with the database.

    - **Returns**:
        - `dict`: A message confirming the closure of the support ticket.

    Example Request:
    ```http
    POST /ticket/close
    ```

    Example Successful Response:
    ```json
    {
        "message": "Closed ticket with ID: 1"
    }
    """
    support_service.close_the_ticket(support_ticket_id=ticket_id, db=db)
    return {"message": f"Closed ticket with ID: {ticket_id}"}
