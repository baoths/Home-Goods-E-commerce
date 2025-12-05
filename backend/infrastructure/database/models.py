"""
Database Models using SQLAlchemy
Compatible with Prisma schema from frontend
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "User"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="CUSTOMER")  # ADMIN or CUSTOMER
    phone = Column(String, nullable=True)
    avatar = Column(Text, nullable=True)  # Base64 image
    address = Column(Text, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    orders = relationship("Order", back_populates="user")


class Category(Base):
    __tablename__ = "Category"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    image = Column(Text, nullable=True)  # Base64 image
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "Product"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    originalPrice = Column(Float, nullable=True)
    discount = Column(Float, default=0.0, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    image = Column(Text, nullable=True)  # Main image (Base64)
    images = Column(Text, nullable=True)  # JSON array of Base64 images
    featured = Column(Boolean, default=False, nullable=False)
    categoryId = Column(String, ForeignKey("Category.id"), nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    category = relationship("Category", back_populates="products")
    orderItems = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "Order"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    orderNumber = Column(String, unique=True, nullable=False)
    userId = Column(String, ForeignKey("User.id"), nullable=False)
    status = Column(String, nullable=False, default="PENDING")  # PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    totalAmount = Column(Float, nullable=False)
    shippingFee = Column(Float, default=0.0, nullable=False)
    discountAmount = Column(Float, default=0.0, nullable=False)
    finalAmount = Column(Float, nullable=False)
    shippingName = Column(String, nullable=False)
    shippingPhone = Column(String, nullable=False)
    shippingAddress = Column(Text, nullable=False)
    note = Column(Text, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "OrderItem"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    orderId = Column(String, ForeignKey("Order.id"), nullable=False)
    productId = Column(String, ForeignKey("Product.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    discount = Column(Float, default=0.0, nullable=False)
    subtotal = Column(Float, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="orderItems")
