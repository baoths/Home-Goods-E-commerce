"""
FastAPI Main Application
Entry point for the backend API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# Import routers
from presentation.api import auth, products, categories

app = FastAPI(
    title="Home Goods E-commerce API",
    description="Backend API for Home Goods Store with Clean Architecture",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Home Goods E-commerce API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])


if __name__ == "__main__":
    import uvicorn
    
    # Chạy server với auto-reload cho development
    uvicorn.run(
        "main:app",  # Application import string
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload khi code thay đổi
        log_level="info"
    )

