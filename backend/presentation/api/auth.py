"""
Authentication API Routes
Handles user registration, login, and authentication
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Request/Response Models
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Mock data for development
MOCK_USERS = [
    {
        "id": "1",
        "email": "admin@homegoods.com",
        "password": "password123",  # In production, this should be hashed
        "name": "Admin",
        "role": "ADMIN",
        "phone": "0123456789",
        "avatar": None,
        "address": "123 Admin Street",
        "created_at": datetime.now()
    },
    {
        "id": "2",
        "email": "customer1@example.com",
        "password": "password123",
        "name": "Customer 1",
        "role": "CUSTOMER",
        "phone": "0987654321",
        "avatar": None,
        "address": "456 Customer Avenue",
        "created_at": datetime.now()
    }
]


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegisterRequest):
    """
    Register a new user account
    """
    # Check if email already exists
    if any(u["email"] == user_data.email for u in MOCK_USERS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user (mock)
    new_user = {
        "id": str(len(MOCK_USERS) + 1),
        "email": user_data.email,
        "password": user_data.password,  # Should hash in production
        "name": user_data.name,
        "role": "CUSTOMER",
        "phone": user_data.phone,
        "avatar": None,
        "address": user_data.address,
        "created_at": datetime.now()
    }
    
    MOCK_USERS.append(new_user)
    
    # Generate token (mock)
    access_token = f"mock_token_{new_user['id']}"
    
    user_response = UserResponse(
        id=new_user["id"],
        email=new_user["email"],
        name=new_user["name"],
        role=new_user["role"],
        phone=new_user["phone"],
        avatar=new_user["avatar"],
        address=new_user["address"],
        created_at=new_user["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLoginRequest):
    """
    Login with email and password
    """
    # Find user
    user = next(
        (u for u in MOCK_USERS if u["email"] == credentials.email),
        None
    )
    
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token (mock)
    access_token = f"mock_token_{user['id']}"
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        phone=user["phone"],
        avatar=user["avatar"],
        address=user["address"],
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/token", response_model=TokenResponse)
async def login_for_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login (for Swagger UI)
    """
    # Find user by username (email)
    user = next(
        (u for u in MOCK_USERS if u["email"] == form_data.username),
        None
    )
    
    if not user or user["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token (mock)
    access_token = f"mock_token_{user['id']}"
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        phone=user["phone"],
        avatar=user["avatar"],
        address=user["address"],
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get current authenticated user
    """
    # Extract user_id from token (mock)
    if not token.startswith("mock_token_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
    
    user_id = token.replace("mock_token_", "")
    user = next((u for u in MOCK_USERS if u["id"] == user_id), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        phone=user["phone"],
        avatar=user["avatar"],
        address=user["address"],
        created_at=user["created_at"]
    )
