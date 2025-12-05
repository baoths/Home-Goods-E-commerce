"""
Domain Layer - Repository Interfaces
SOLID Principle: Dependency Inversion - Depend on abstractions, not concretions
SOLID Principle: Interface Segregation - Specific interfaces for each repository
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from domain.entities import User, Product, Category, Banner, Order, OrderItem


class IUserRepository(ABC):
    """User Repository Interface"""
    
    @abstractmethod
    async def create(self, user: User) -> User:
        """Create a new user"""
        pass
    
    @abstractmethod
    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        pass
    
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        pass
    
    @abstractmethod
    async def update(self, user: User) -> User:
        """Update user information"""
        pass
    
    @abstractmethod
    async def delete(self, user_id: str) -> bool:
        """Delete user"""
        pass


class IProductRepository(ABC):
    """Product Repository Interface"""
    
    @abstractmethod
    async def create(self, product: Product) -> Product:
        """Create a new product"""
        pass
    
    @abstractmethod
    async def get_by_id(self, product_id: str) -> Optional[Product]:
        """Get product by ID"""
        pass
    
    @abstractmethod
    async def get_by_slug(self, slug: str) -> Optional[Product]:
        """Get product by slug"""
        pass
    
    @abstractmethod
    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        category_id: Optional[str] = None,
        featured: Optional[bool] = None
    ) -> List[Product]:
        """Get all products with optional filters"""
        pass
    
    @abstractmethod
    async def update(self, product: Product) -> Product:
        """Update product"""
        pass
    
    @abstractmethod
    async def delete(self, product_id: str) -> bool:
        """Delete product"""
        pass


class ICategoryRepository(ABC):
    """Category Repository Interface"""
    
    @abstractmethod
    async def create(self, category: Category) -> Category:
        """Create a new category"""
        pass
    
    @abstractmethod
    async def get_by_id(self, category_id: str) -> Optional[Category]:
        """Get category by ID"""
        pass
    
    @abstractmethod
    async def get_all(self) -> List[Category]:
        """Get all categories"""
        pass
    
    @abstractmethod
    async def update(self, category: Category) -> Category:
        """Update category"""
        pass
    
    @abstractmethod
    async def delete(self, category_id: str) -> bool:
        """Delete category"""
        pass


class IBannerRepository(ABC):
    """Banner Repository Interface"""
    
    @abstractmethod
    async def create(self, banner: Banner) -> Banner:
        """Create a new banner"""
        pass
    
    @abstractmethod
    async def get_active_banners(self) -> List[Banner]:
        """Get all active banners"""
        pass
    
    @abstractmethod
    async def update(self, banner: Banner) -> Banner:
        """Update banner"""
        pass
    
    @abstractmethod
    async def delete(self, banner_id: str) -> bool:
        """Delete banner"""
        pass


class IOrderRepository(ABC):
    """Order Repository Interface"""
    
    @abstractmethod
    async def create(self, order: Order, items: List[OrderItem]) -> Order:
        """Create a new order with items"""
        pass
    
    @abstractmethod
    async def get_by_id(self, order_id: str) -> Optional[Order]:
        """Get order by ID"""
        pass
    
    @abstractmethod
    async def get_by_user(self, user_id: str) -> List[Order]:
        """Get all orders for a user"""
        pass
    
    @abstractmethod
    async def update_status(self, order_id: str, status: str) -> Order:
        """Update order status"""
        pass
