"""
Domain Layer - Entities
Clean Architecture: Core business objects that represent the domain model
SOLID Principle: Single Responsibility - Each entity represents one concept
"""

from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class User:
    """User Entity - Represents a user in the system"""
    def __init__(
        self,
        id: str,
        email: str,
        password: str,
        name: str,
        role: UserRole,
        phone: Optional[str] = None,
        avatar: Optional[str] = None,
        address: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.email = email
        self.password = password
        self.name = name
        self.role = role
        self.phone = phone
        self.avatar = avatar
        self.address = address
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
    
    def is_admin(self) -> bool:
        """Check if user has admin role"""
        return self.role == UserRole.ADMIN


class Category:
    """Category Entity - Product categorization"""
    def __init__(
        self,
        id: str,
        name: str,
        slug: str,
        description: Optional[str] = None,
        image: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.name = name
        self.slug = slug
        self.description = description
        self.image = image
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()


class Product:
    """Product Entity - Represents a product for sale"""
    def __init__(
        self,
        id: str,
        name: str,
        slug: str,
        description: str,
        price: Decimal,
        category_id: str,
        discount: Decimal = Decimal("0"),
        stock: int = 0,
        image: Optional[str] = None,
        images: Optional[List[str]] = None,
        featured: bool = False,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.name = name
        self.slug = slug
        self.description = description
        self.price = price
        self.category_id = category_id
        self.discount = discount
        self.stock = stock
        self.image = image
        self.images = images or []
        self.featured = featured
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
    
    def get_final_price(self) -> Decimal:
        """Calculate price after discount"""
        if self.discount > 0:
            discount_amount = (self.price * self.discount) / Decimal("100")
            return self.price - discount_amount
        return self.price
    
    def is_in_stock(self) -> bool:
        """Check if product is available"""
        return self.stock > 0


class Banner:
    """Banner Entity - Homepage promotional banners"""
    def __init__(
        self,
        id: str,
        title: str,
        image: str,
        subtitle: Optional[str] = None,
        link: Optional[str] = None,
        order: int = 0,
        active: bool = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.title = title
        self.subtitle = subtitle
        self.image = image
        self.link = link
        self.order = order
        self.active = active
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()


class Order:
    """Order Entity - Customer purchase order"""
    def __init__(
        self,
        id: str,
        order_number: str,
        user_id: str,
        status: OrderStatus,
        total_amount: Decimal,
        final_amount: Decimal,
        shipping_name: str,
        shipping_phone: str,
        shipping_address: str,
        shipping_fee: Decimal = Decimal("0"),
        discount_amount: Decimal = Decimal("0"),
        note: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.order_number = order_number
        self.user_id = user_id
        self.status = status
        self.total_amount = total_amount
        self.shipping_fee = shipping_fee
        self.discount_amount = discount_amount
        self.final_amount = final_amount
        self.shipping_name = shipping_name
        self.shipping_phone = shipping_phone
        self.shipping_address = shipping_address
        self.note = note
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
    
    def can_be_cancelled(self) -> bool:
        """Check if order can be cancelled"""
        return self.status in [OrderStatus.PENDING, OrderStatus.PROCESSING]


class OrderItem:
    """OrderItem Entity - Individual items in an order"""
    def __init__(
        self,
        id: str,
        order_id: str,
        product_id: str,
        quantity: int,
        price: Decimal,
        discount: Decimal,
        subtotal: Decimal,
    ):
        self.id = id
        self.order_id = order_id
        self.product_id = product_id
        self.quantity = quantity
        self.price = price
        self.discount = discount
        self.subtotal = subtotal
