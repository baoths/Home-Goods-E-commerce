"""
Categories API Routes
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str]
    image: Optional[str]
    product_count: int


MOCK_CATEGORIES = [
    {
        "id": "1",
        "name": "Nhà Bếp",
        "slug": "kitchen",
        "description": "Đồ dùng nhà bếp chất lượng cao",
        "image": "🍳",
        "product_count": 25
    },
    {
        "id": "2",
        "name": "Nội Thất",
        "slug": "furniture",
        "description": "Nội thất gia đình hiện đại",
        "image": "🪑",
        "product_count": 30
    },
    {
        "id": "3",
        "name": "Vệ Sinh",
        "slug": "cleaning",
        "description": "Dụng cụ vệ sinh nhà cửa",
        "image": "🧹",
        "product_count": 20
    },
    {
        "id": "4",
        "name": "Trang Trí",
        "slug": "decor",
        "description": "Đồ trang trí nội thất",
        "image": "🎨",
        "product_count": 15
    }
]


@router.get("/", response_model=List[CategoryResponse])
async def get_categories():
    """Get all categories"""
    return [CategoryResponse(**cat) for cat in MOCK_CATEGORIES]


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    """Get category by ID"""
    category = next((c for c in MOCK_CATEGORIES if c["id"] == category_id), None)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return CategoryResponse(**category)


@router.get("/slug/{slug}", response_model=CategoryResponse)
async def get_category_by_slug(slug: str):
    """Get category by slug"""
    category = next((c for c in MOCK_CATEGORIES if c["slug"] == slug), None)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return CategoryResponse(**category)
