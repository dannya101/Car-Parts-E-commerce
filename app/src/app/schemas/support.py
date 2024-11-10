from pydantic import BaseModel, Field
from typing import List, Optional

class SupportTicketBase(BaseModel):
    title: str
    description: str
    
    #didnt think I needed this
    # class Config:
    #     orm_mode = True