from sqlalchemy import Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, mapped_column, Mapped
from typing import List

from datetime import UTC, datetime

from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    cart_id: Mapped[int] = mapped_column(Integer, ForeignKey("carts.id"), nullable=False)
    shipping_address_id: Mapped[str] = mapped_column(String, ForeignKey("addresses.id"), nullable=True)
    billing_address_id: Mapped[str] = mapped_column(String, ForeignKey("addresses.id"), nullable=True)
    status: Mapped[str] = mapped_column(String)
    total_price: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    user= relationship("User", back_populates="orders")
    cart = relationship("Cart", back_populates="order")
    items = relationship("OrderItem", back_populates="order")

    billing_address = relationship("Address", foreign_keys=[billing_address_id], uselist=False)
    shipping_address = relationship("Address", foreign_keys=[shipping_address_id], uselist=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
