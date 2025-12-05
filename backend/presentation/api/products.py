"""
Products API Routes
Handles product listing, details, and management
"""

from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

router = APIRouter()


# Response Models
class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    price: float
    original_price: float
    discount: float
    stock: int
    image: Optional[str]
    images: List[str]
    featured: bool
    category_id: str
    category_name: str
    rating: float
    review_count: int
    sold: int
    created_at: datetime


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Mock products data
MOCK_CATEGORIES = {
    "1": {"id": "1", "name": "Nhà Bếp", "slug": "kitchen"},
    "2": {"id": "2", "name": "Nội Thất", "slug": "furniture"},
    "3": {"id": "3", "name": "Vệ Sinh", "slug": "cleaning"},
    "4": {"id": "4", "name": "Trang Trí", "slug": "decor"}
}

MOCK_PRODUCTS = [
    {
        "id": f"{i}",
        "name": f"Sản phẩm {i}",
        "slug": f"san-pham-{i}",
        "description": f"Mô tả chi tiết về sản phẩm {i}. Đây là sản phẩm chất lượng cao được thiết kế đặc biệt.",
        "price": float(500000 + i * 100000),
        "discount": float((i % 5) * 10),
        "stock": 50 + i * 10,
        "image": "🛍️",
        "images": ["🛍️", "📦", "🎁", "✨"],
        "featured": i % 3 == 0,
        "category_id": str((i % 4) + 1),
        "rating": 4.0 + (i % 10) * 0.1,
        "review_count": 50 + i * 10,
        "sold": 100 + i * 50,
        "created_at": datetime.now()
    }
    for i in range(1, 51)  # 50 mock products
]


@router.get("/", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "newest"  # newest, price_asc, price_desc, best_selling
):
    """
    Get paginated list of products with filters
    """
    # Filter products
    filtered_products = MOCK_PRODUCTS.copy()
    
    # Filter by category
    if category:
        category_obj = next((c for c in MOCK_CATEGORIES.values() if c["slug"] == category), None)
        if category_obj:
            filtered_products = [p for p in filtered_products if p["category_id"] == category_obj["id"]]
    
    # Filter by featured
    if featured is not None:
        filtered_products = [p for p in filtered_products if p["featured"] == featured]
    
    # Search by name
    if search:
        filtered_products = [p for p in filtered_products if search.lower() in p["name"].lower()]
    
    # Sort
    if sort_by == "price_asc":
        filtered_products.sort(key=lambda x: x["price"])
    elif sort_by == "price_desc":
        filtered_products.sort(key=lambda x: x["price"], reverse=True)
    elif sort_by == "best_selling":
        filtered_products.sort(key=lambda x: x["sold"], reverse=True)
    elif sort_by == "rating":
        filtered_products.sort(key=lambda x: x["rating"], reverse=True)
    else:  # newest
        filtered_products.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Pagination
    total = len(filtered_products)
    total_pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    end = start + page_size
    
    paginated_products = filtered_products[start:end]
    
    # Build response
    products_response = []
    for p in paginated_products:
        category = MOCK_CATEGORIES.get(p["category_id"], {})
        original_price = p["price"] / (1 - p["discount"] / 100) if p["discount"] > 0 else p["price"]
        
        products_response.append(ProductResponse(
            id=p["id"],
            name=p["name"],
            slug=p["slug"],
            description=p["description"],
            price=p["price"],
            original_price=original_price,
            discount=p["discount"],
            stock=p["stock"],
            image=p["image"],
            images=p["images"],
            featured=p["featured"],
            category_id=p["category_id"],
            category_name=category.get("name", "Unknown"),
            rating=p["rating"],
            review_count=p["review_count"],
            sold=p["sold"],
            created_at=p["created_at"]
        ))
    
    return ProductListResponse(
        products=products_response,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """
    Get single product by ID
    """
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    category = MOCK_CATEGORIES.get(product["category_id"], {})
    original_price = product["price"] / (1 - product["discount"] / 100) if product["discount"] > 0 else product["price"]
    
    return ProductResponse(
        id=product["id"],
        name=product["name"],
        slug=product["slug"],
        description=product["description"],
        price=product["price"],
        original_price=original_price,
        discount=product["discount"],
        stock=product["stock"],
        image=product["image"],
        images=product["images"],
        featured=product["featured"],
        category_id=product["category_id"],
        category_name=category.get("name", "Unknown"),
        rating=product["rating"],
        review_count=product["review_count"],
        sold=product["sold"],
        created_at=product["created_at"]
    )


@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str):
    """
    Get single product by slug
    """
    product = next((p for p in MOCK_PRODUCTS if p["slug"] == slug), None)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    category = MOCK_CATEGORIES.get(product["category_id"], {})
    original_price = product["price"] / (1 - product["discount"] / 100) if product["discount"] > 0 else product["price"]
    
    return ProductResponse(
        id=product["id"],
        name=product["name"],
        slug=product["slug"],
        description=product["description"],
        price=product["price"],
        original_price=original_price,
        discount=product["discount"],
        stock=product["stock"],
        image=product["image"],
        images=product["images"],
        featured=product["featured"],
        category_id=product["category_id"],
        category_name=category.get("name", "Unknown"),
        rating=product["rating"],
        review_count=product["review_count"],
        sold=product["sold"],
        created_at=product["created_at"]
    )
