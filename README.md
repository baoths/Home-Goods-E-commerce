# 🏠 Home Goods E-commerce

Website bán đồ gia dụng online với Clean Architecture và SOLID principles.

## 📋 Giới thiệu

Dự án fullstack e-commerce:
- **Backend**: Python FastAPI với Clean Architecture
- **Frontend**: Next.js 14 + TypeScript
- **Database**: PostgreSQL (NeonDB) với Prisma ORM

## 🚀 Cài đặt

### Frontend

```bash
cd frontend
pnpm i
```

> Script `postinstall` sẽ tự động chạy `prisma generate`

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## ▶️ Chạy ứng dụng

### Frontend
```bash
cd frontend
pnpm dev
```
→ http://localhost:3000

### Backend
```bash
cd backend
venv\Scripts\activate
python main.py
```
→ http://localhost:8000  
→ http://localhost:8000/docs (API Documentation)

## 📁 Cấu trúc dự án

```
.
├── backend/                    # Python FastAPI Backend
│   ├── domain/                # Domain Layer (Entities & Business Rules)
│   │   ├── entities.py        # Core business entities
│   │   └── repositories.py    # Repository interfaces (DIP)
│   ├── application/           # Application Layer (Use Cases)
│   │   ├── use_cases.py       # Business logic orchestration
│   │   └── dto.py             # Data Transfer Objects
│   ├── infrastructure/        # Infrastructure Layer
│   │   └── utils/             # JWT, password hashing utilities
│   ├── presentation/          # Presentation Layer (API Routes)
│   ├── config.py              # Settings & configuration
│   └── main.py                # FastAPI app entry point
│
└── frontend/                  # Next.js Frontend
    ├── app/                   # Next.js App Router
    │   ├── admin/            # Admin pages
    │   ├── profile/          # User profile
    │   ├── layout.tsx        # Root layout
    │   └── page.tsx          # Homepage
    ├── lib/                   # Utilities
    │   ├── prisma.ts         # Prisma client singleton
    │   └── image.ts          # Image processing utilities
    ├── prisma/
    │   ├── schema.prisma     # Database schema
    │   └── seed.ts           # Mock data seeder
    └── components/            # Reusable React components
```

## 🏗️ Clean Architecture

### 4 Layers

#### 1. Domain Layer (Core)
- **Entities**: Business objects với business logic
- **Repository Interfaces**: Contracts cho data access (DIP)
- **Độc lập**: Không phụ thuộc vào layer khác

```python
# domain/entities.py
class Product:
    def get_final_price(self) -> float:
        if self.discount_percent > 0:
            return self.price * (1 - self.discount_percent / 100)
        return self.price
```

#### 2. Application Layer (Use Cases)
- **Use Cases**: Orchestrate business logic
- **DTOs**: Data transfer between layers
- **SRP**: Mỗi use case làm 1 việc

```python
# application/use_cases.py
class CreateProductUseCase:
    def __init__(self, product_repo: IProductRepository):
        self.product_repo = product_repo  # Dependency Injection
    
    def execute(self, product_data: CreateProductDTO) -> Product:
        # Business logic here
        return self.product_repo.create(product)
```

#### 3. Infrastructure Layer
- **Repository Implementations**: Implement domain interfaces
- **External Services**: Database, APIs
- **Utils**: Password hashing, JWT tokens

```python
# infrastructure/utils/password_utils.py
def hash_password(password: str) -> str:
    # Hash password với bcrypt
```

#### 4. Presentation Layer (API)
- **FastAPI Routes**: HTTP endpoints
- **Request/Response Models**: Pydantic schemas
- **Dependency Injection**: Inject use cases

```python
# presentation/api/routes/products.py
@router.post("/products")
async def create_product(
    data: CreateProductRequest,
    use_case: CreateProductUseCase = Depends()
):
    return use_case.execute(data)
```

### Flow của request
```
HTTP Request 
  → Presentation Layer (validate input)
  → Application Layer (use case logic) 
  → Domain Layer (business rules)
  → Infrastructure Layer (database)
  → Response back through layers
```

## 🎯 SOLID Principles

### S - Single Responsibility Principle
Mỗi class chỉ có 1 lý do để thay đổi.

```python
# ✅ Good: Mỗi use case làm 1 việc
class RegisterUserUseCase:
    def execute(self, data): ...

class LoginUserUseCase:
    def execute(self, credentials): ...
```

### O - Open/Closed Principle
Mở cho mở rộng, đóng cho sửa đổi.

```python
# ✅ Good: Extend bằng inheritance
class Entity:
    def __init__(self, id, created_at, updated_at):
        self.id = id
        self.created_at = created_at
        self.updated_at = updated_at

class Product(Entity):  # Extend, không modify Entity
    def __init__(self, id, name, price, ...):
        super().__init__(id, created_at, updated_at)
        self.name = name
```

### L - Liskov Substitution Principle
Subclass có thể thay thế base class mà không làm hỏng chương trình.

```python
# ✅ Good: Repository implementations thay thế được interface
class IProductRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: str) -> Product: ...

class PrismaProductRepository(IProductRepository):
    def find_by_id(self, id: str) -> Product:
        # Implementation with Prisma
```

### I - Interface Segregation Principle
Client không nên phụ thuộc vào interface mà nó không dùng.

```python
# ✅ Good: Chia nhỏ interfaces
class IProductRepository(ABC):  # Chỉ product operations
    def create(self, product): ...
    def find_by_id(self, id): ...

class IUserRepository(ABC):    # Riêng user operations
    def create(self, user): ...
    def find_by_email(self, email): ...
```

### D - Dependency Inversion Principle
Phụ thuộc vào abstraction, không phụ thuộc vào concrete implementation.

```python
# ✅ Good: Use case phụ thuộc vào interface
class CreateProductUseCase:
    def __init__(self, product_repo: IProductRepository):  # Interface
        self.product_repo = product_repo
    
    def execute(self, data):
        return self.product_repo.create(data)

# Có thể swap implementation
use_case = CreateProductUseCase(PrismaProductRepository())
# hoặc
use_case = CreateProductUseCase(MongoProductRepository())
```

## 🎨 Features

### Admin
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục
- Quản lý banner trang chủ
- Upload ảnh sản phẩm (frontend convert to base64)
- Quản lý đơn hàng

### User
- Xem sản phẩm theo danh mục
- Tìm kiếm sản phẩm
- Giỏ hàng
- Đặt hàng
- Đổi avatar
- Lịch sử đơn hàng

## 🔧 Tech Stack

**Backend:**
- FastAPI - Web framework
- Pydantic - Data validation
- python-jose - JWT authentication
- bcrypt - Password hashing

**Frontend:**
- Next.js 14 - React framework
- TypeScript - Type safety
- Prisma - ORM
- TailwindCSS - Styling
- Canvas API - Image processing & base64 conversion

## 📄 License

MIT
