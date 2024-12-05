from pydantic import BaseModel
from typing import List


class Address(BaseModel):
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str
    is_billing: bool
    is_shipping: bool
