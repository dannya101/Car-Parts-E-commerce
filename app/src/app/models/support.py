from datetime import UTC, datetime
from typing import List, Optional

from sqlalchemy import Integer, String, Column, ForeignKey, DateTime
from sqlalchemy.orm import relationship, backref, mapped_column, Mapped
from app.core.database import Base

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String)
    # support_ticket_created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    ticket_replies: Mapped[str] = mapped_column(String, ForeignKey("ticket_replies.id"))
    # ticket_reply_content: Mapped[str] = mapped_column(String, nullable=False)
    # ticket_reply_created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    user = relationship("User", back_populates="tickets")
    ticket_replies = relationship("TicketReplies", back_populates="ticket")


class TicketReplies(Base):
    __tablename__ = "ticket_replies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    ticket_id: Mapped[int] = mapped_column(Integer, ForeignKey("support_tickets.id"), nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())

    user = relationship("User")
    ticket = relationship("SupportTicket", back_populates="ticket_replies")

# from app.models.user import User