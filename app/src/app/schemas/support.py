from pydantic import BaseModel, Field
from typing import List, Optional

class SupportTicketBase(BaseModel):
    title: str
    description: str
    
    class Config:
        orm_mode = True