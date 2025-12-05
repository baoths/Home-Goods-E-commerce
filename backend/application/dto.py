"""
Application Layer - DTOs (Data Transfer Objects)
SOLID Principle: Single Responsibility - Each DTO has one purpose
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


# ============= User DTOs =============

class UserCreateDTO(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserUpdateDTO(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar: Optional[str] = None  # Base64 image


class UserResponseDTO(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class LoginDTO(BaseModel):
    email: EmailStr
    password: str


class TokenResponseDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseDTO


# ============= Category DTOs =============

class CategoryCreateDTO(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None  # Base64 image


class CategoryUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None  # Base64 image


class CategoryResponseDTO(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Product DTOs =============

class ProductCreateDTO(BaseModel):
    name: str
    slug: str
    description: str
    price: Decimal = Field(..., gt=0)
    category_id: str
    discount: Decimal = Field(default=Decimal("0"), ge=0, le=100)
    stock: int = Field(default=0, ge=0)
    image: str  # Base64 image (required)
    images: Optional[List[str]] = None  # Array of base64 images
    featured: bool = False


class ProductUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    category_id: Optional[str] = None
    discount: Optional[Decimal] = Field(None, ge=0, le=100)
    stock: Optional[int] = Field(None, ge=0)
    image: Optional[str] = None  # Base64 image
    images: Optional[List[str]] = None
    featured: Optional[bool] = None


class ProductResponseDTO(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    price: Decimal
    discount: Decimal
    final_price: Decimal
    stock: int
    image: str
    images: List[str]
    featured: bool
    category_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Banner DTOs =============

class BannerCreateDTO(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image: str  # Base64 image
    link: Optional[str] = None
    order: int = 0
    active: bool = True


class BannerUpdateDTO(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image: Optional[str] = None  # Base64 image
    link: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class BannerResponseDTO(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    image: str
    link: Optional[str] = None
    order: int
    active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Order DTOs =============

class OrderItemCreateDTO(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class OrderCreateDTO(BaseModel):
    items: List[OrderItemCreateDTO]
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    note: Optional[str] = None


class OrderItemResponseDTO(BaseModel):
    id: str
    product_id: str
    quantity: int
    price: Decimal
    discount: Decimal
    subtotal: Decimal
    
    class Config:
        from_attributes = True


class OrderResponseDTO(BaseModel):
    id: str
    order_number: str
    user_id: str
    status: str
    total_amount: Decimal
    shipping_fee: Decimal
    discount_amount: Decimal
    final_amount: Decimal
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    note: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponseDTO] = []
    
    class Config:
        from_attributes = True
