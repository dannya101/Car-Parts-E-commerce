from sqlalchemy import Integer, String, Float, Column, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped

from app.core.database import Base

import json

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
    models: Mapped[list["ModelCategory"]] = relationship("ModelCategory", back_populates="brand")

class ModelCategory(Base):
    __tablename__ = "model_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[int] = mapped_column(Integer, ForeignKey("brand_categories.id"), nullable=False)
    model_name: Mapped[str] = mapped_column(String, index=True)

    brand: Mapped["BrandCategory"] = relationship("BrandCategory")

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float)
    part_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("part_categories.id"), nullable=False)
    brand_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("brand_categories.id"), nullable=False)
    model_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("model_categories.id"))
    tags: Mapped[str] = mapped_column(String)
    images: Mapped[str] = mapped_column(String)
    thumbnail: Mapped[str] = mapped_column(String)

    part_category: Mapped["PartCategory"] = relationship("PartCategory", back_populates="products")
    brand_category: Mapped["BrandCategory"] = relationship("BrandCategory", back_populates="products")
    model_category: Mapped["ModelCategory"] = relationship("ModelCategory")

    def set_tags(self, tags: list):
        self.tags = json.dumps(tags)

    def get_tags(self):
        return json.loads(self.tags) if self.tags else []

    def set_images(self, images: list):
        self.images = json.dumps(images)

    def get_images(self):
        return json.loads(self.images) if self.images else []
