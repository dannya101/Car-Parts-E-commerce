from sqlalchemy import Integer, String, Float, Column, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped

from app.core.database import Base

class PartCategory(Base):
    __tablename__ = "part_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    part_type_name: Mapped[str] = mapped_column(String, unique=True, index=True)
    part_type_description: Mapped[str] = mapped_column(String)

    products: Mapped[list["Product"]] = relationship("Product", back_populates="part_category")

class BrandCategory(Base):
    __tablename__ = "brand_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_type_name: Mapped[str] = mapped_column(String, unique=True, index=True)
    brand_type_description: Mapped[str] = mapped_column(String)

    products: Mapped[list["Product"]] = relationship("Product", back_populates="brand_category")

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float)
    part_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("part_categories.id"), nullable=False)
    brand_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("brand_categories.id"), nullable=False)
    tags: Mapped[str] = mapped_column(String)
    images: Mapped[str] = mapped_column(String)
    thumbnail: Mapped[str] = mapped_column(String)

    part_category: Mapped["PartCategory"] = relationship("PartCategory", back_populates="products")
    brand_category: Mapped["BrandCategory"] = relationship("BrandCategory", back_populates="products")
