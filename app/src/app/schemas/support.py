from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SupportTicketBase(BaseModel):
    title: str
    description: str
        
    class Config:
        orm_mode = True

class TicketReply(BaseModel):
    ticket_id: int
    content: str