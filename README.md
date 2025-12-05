# 🏠 Home Goods E-commerce

Website bán đồ gia dụng online với Clean Architecture và SOLID principles.

## 📋 Giới thiệu

Dự án fullstack e-commerce:
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Python FastAPI với Clean Architecture (Optional)
- **Database**: PostgreSQL (NeonDB) với Prisma ORM
- **Authentication**: JWT-based auth
- **State Management**: React Hooks + localStorage

## ✨ Tính năng

### 🛍️ Người dùng
- ✅ Đăng ký/Đăng nhập với JWT authentication
- ✅ Xem danh sách sản phẩm với pagination & filters
- ✅ Tìm kiếm sản phẩm
- ✅ Xem chi tiết sản phẩm với gallery hình ảnh
- ✅ Lọc sản phẩm theo category
- ✅ Sắp xếp sản phẩm (mới nhất, giá, tên)
- ✅ Cập nhật profile với avatar upload (Base64)
- ✅ Responsive design

### 👨‍💼 Admin
- ✅ Dashboard thống kê (sản phẩm, categories, users, orders)
- ✅ Quản lý sản phẩm (CRUD)
  - Thêm/sửa/xóa sản phẩm
  - Upload hình ảnh (single + multiple images)
  - Quản lý stock, giá, discount
- ✅ Quản lý categories (CRUD)
- ✅ Quản lý users (view, edit, delete)
- ✅ Role-based access control

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd Home-Goods-E-commerce
```

### 2. Setup Frontend

```bash
cd frontend
npm install
# hoặc
pnpm install
```

**Cấu hình database:**
1. Copy `.env.example` thành `.env`
2. Cập nhật `DATABASE_URL` và `JWT_SECRET`

```bash
npx prisma generate
npx prisma db push
npm run dev
```

→ Frontend: http://localhost:3000

### 3. Setup Backend (Optional)

Backend Python là optional vì frontend đã có API routes riêng. Nếu muốn sử dụng:

**Windows:**
```bash
cd backend
setup.bat
start.bat
```

**macOS/Linux:**
```bash
cd backend
chmod +x setup.sh start.sh
./setup.sh
./start.sh
```

→ Backend API: http://localhost:8000  
→ API Docs: http://localhost:8000/docs

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

## 🗄️ Database Schema

### Tables

- **User**: Người dùng (customers & admins)
- **Category**: Danh mục sản phẩm
- **Product**: Sản phẩm với images (Base64)
- **Order**: Đơn hàng
- **OrderItem**: Chi tiết đơn hàng

### Key Features

- ✅ PostgreSQL với Prisma ORM
- ✅ UUID primary keys
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Foreign key relationships
- ✅ Base64 image storage
- ✅ Indexes trên slug và email

## 🔐 Authentication

- **JWT-based authentication**
- Token expiration: 30 minutes
- Roles: ADMIN, CUSTOMER
- Protected routes với middleware
- Password hashing với bcrypt

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons
- Optimized images

### Image Handling
- Base64 encoding/decoding
- Image compression (800px max width)
- Multiple image support
- Gallery view với thumbnails
- Avatar upload với preview

### User Experience
- Loading states
- Error handling
- Form validation
- Toast notifications
- Smooth transitions
- Hover effects

## 🔧 Tech Stack

**Frontend:**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Prisma ORM
- **Auth**: JWT (jsonwebtoken)
- **Image**: Canvas API (Base64 conversion)
- **HTTP**: Fetch API

**Backend (Optional):**
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Auth**: PyJWT
- **Password**: bcrypt
- **Database**: PostgreSQL via psycopg2

## 📝 API Endpoints

### Frontend API Routes (Next.js)

**Auth:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Current user
- `PUT /api/auth/me` - Update profile

**Products:**
- `GET /api/products` - List products
- `GET /api/products/[id]` - Product detail
- `POST /api/products` - Create (Admin)
- `PUT /api/products/[id]` - Update (Admin)
- `DELETE /api/products/[id]` - Delete (Admin)

**Categories:**
- `GET /api/categories` - List categories
- `GET /api/categories/[id]` - Category detail
- `POST /api/categories` - Create (Admin)
- `PUT /api/categories/[id]` - Update (Admin)
- `DELETE /api/categories/[id]` - Delete (Admin)

**Users:**
- `GET /api/users` - List users (Admin)
- `GET /api/users/[id]` - User detail (Admin)
- `PUT /api/users/[id]` - Update user (Admin)
- `DELETE /api/users/[id]` - Delete user (Admin)

**Admin:**
- `GET /api/admin/statistics` - Dashboard stats

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

### Backend (Render/Railway)

```bash
cd backend
# Deploy theo hướng dẫn của platform
```

### Database (NeonDB)

1. Tạo project tại neon.tech
2. Copy DATABASE_URL
3. Update .env files
4. Run `npx prisma db push`

## 🧪 Testing

```bash
# Frontend
cd frontend
npm test

# Backend  
cd backend
pytest
```

## 📚 Documentation

- **Frontend**: See `/frontend/README.md`
- **Backend**: See `/backend/README.md`
- **API Docs**: http://localhost:8000/docs (when backend running)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- Backend Architecture: Clean Architecture + SOLID principles
- Frontend: Next.js 14 + TypeScript
- Database: PostgreSQL with Prisma

## 🙏 Acknowledgments

- FastAPI documentation
- Next.js documentation
- Clean Architecture by Robert C. Martin
- SOLID principles