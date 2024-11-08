from sqlalchemy import Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship, mapped_column, Mapped

from app.core.database import Base

class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    street_address: Mapped[str] = mapped_column(String)
    city: Mapped[str] = mapped_column(String)
    state: Mapped[str] = mapped_column(String)
    postal_code: Mapped[str] = mapped_column(String)
    country: Mapped[str] = mapped_column(String)
    is_billing: Mapped[bool] = mapped_column(Boolean)
    is_shipping: Mapped[bool] = mapped_column(Boolean)

    user = relationship("User", back_populates="addresses")
