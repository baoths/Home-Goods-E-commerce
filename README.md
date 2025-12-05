# 🏠 Hệ thống Bán Đồ Gia Dụng

## 📋 Tổng Quan
Dự án fullstack bán hàng đồ gia dụng online với:
- **Backend**: Python FastAPI với Clean Architecture
- **Frontend**: Next.js 14+ với TypeScript
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Prisma

## 📚 Documentation

### 📂 Tất cả Documentation
📑 **[docs/INDEX.md](docs/INDEX.md)** - Mục lục đầy đủ tất cả tài liệu

### 🚀 Getting Started
| Document | Description | Time |
|----------|-------------|------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | **START HERE** - 3 bước cơ bản | 2 min |
| [QUICK_START.md](QUICK_START.md) | Chạy nhanh project | 5 min |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Hướng dẫn setup chi tiết | 10 min |

### 🔧 Frontend Documentation
| Document | Description |
|----------|-------------|
| [docs/frontend/INDEX.md](docs/frontend/INDEX.md) | 📘 Mục lục Frontend |
| [docs/frontend/FIX-ERRORS.md](docs/frontend/FIX-ERRORS.md) | ⚡ **SỬA LỖI NHANH** (3 bước) |
| [docs/frontend/ERRORS_EXPLAINED.md](docs/frontend/ERRORS_EXPLAINED.md) | 📝 Giải thích lỗi TypeScript |
| [docs/frontend/TROUBLESHOOTING.md](docs/frontend/TROUBLESHOOTING.md) | 🔍 Troubleshooting chi tiết |

### 🏗️ Backend Documentation
| Document | Description |
|----------|-------------|
| [docs/backend/INDEX.md](docs/backend/INDEX.md) | 📗 Mục lục Backend |
| [docs/backend/ARCHITECTURE.md](docs/backend/ARCHITECTURE.md) | 🏛️ Clean Architecture chi tiết |
| [docs/backend/CLEAN_ARCHITECTURE_EXPLAINED.md](docs/backend/CLEAN_ARCHITECTURE_EXPLAINED.md) | 📚 Giải thích cho người mới |

### 📖 General Documentation
| Document | Description |
|----------|-------------|
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Tổng kết features, stats, tech stack |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Hướng dẫn deploy production |
| [CHECKLIST.md](CHECKLIST.md) | ✅ Developer checklist |

**👉 Lần đầu? Bắt đầu tại [GETTING_STARTED.md](GETTING_STARTED.md)**  
**⚠️ Thấy lỗi frontend? Xem [docs/frontend/FIX-ERRORS.md](docs/frontend/FIX-ERRORS.md)**  
**📚 Xem toàn bộ docs? [docs/INDEX.md](docs/INDEX.md)**

## 🏗️ Kiến Trúc

### Backend Architecture (Clean Architecture + SOLID)
```
backend/
├── domain/              # Entities & Business Rules (SOLID: SRP, OCP)
│   ├── entities/       # Domain models
│   ├── repositories/   # Repository interfaces (DIP)
│   └── services/       # Domain services
├── application/         # Use Cases (SRP)
│   ├── use_cases/      # Business logic
│   └── dto/            # Data Transfer Objects
├── infrastructure/      # External services (DIP)
│   ├── database/       # Prisma connection
│   ├── repositories/   # Repository implementations
│   └── utils/          # Helpers (image conversion, etc.)
└── presentation/        # API Layer (ISP)
    ├── api/            # FastAPI routes
    └── schemas/        # Request/Response models
```

### Frontend Architecture
```
frontend/
├── app/                # Next.js App Router
│   ├── (admin)/       # Admin pages
│   └── (user)/        # User pages
├── components/         # Reusable components
├── lib/               # Utilities
│   ├── prisma.ts      # Prisma client
│   └── image.ts       # Image utilities
└── prisma/
    └── schema.prisma  # Database schema
```

## 🚀 Cài Đặt

### Prerequisites
- Python 3.10+
- Node.js 18+
- NeonDB account

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Environment Variables

**backend/.env**
```env
DATABASE_URL="postgresql://..."
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**frontend/.env**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🏃 Chạy Ứng Dụng

### Development
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📊 Database Schema

### Tables
- **User**: Thông tin người dùng (admin/customer)
- **Category**: Danh mục sản phẩm
- **Product**: Sản phẩm đồ gia dụng
- **Banner**: Banner trang chủ
- **Order**: Đơn hàng
- **OrderItem**: Chi tiết đơn hàng

## 🎯 Features

### Admin
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục
- ✅ Quản lý banner trang chủ
- ✅ Upload ảnh (convert to base64)
- ✅ Quản lý đơn hàng
- ✅ Đổi avatar

### User
- ✅ Xem sản phẩm theo danh mục
- ✅ Tìm kiếm sản phẩm
- ✅ Giỏ hàng
- ✅ Đặt hàng
- ✅ Đổi avatar
- ✅ Lịch sử mua hàng

## 🔧 Tech Stack

### Backend
- FastAPI
- SQLAlchemy (via Prisma)
- Pydantic
- python-jose (JWT)
- passlib (password hashing)
- Pillow (image processing)

### Frontend
- Next.js 14
- TypeScript
- Prisma Client
- TailwindCSS
- Shadcn/ui

## 📝 SOLID Principles Applied

1. **Single Responsibility**: Mỗi use case chỉ làm 1 việc
2. **Open/Closed**: Entities mở rộng qua inheritance
3. **Liskov Substitution**: Repository interfaces
4. **Interface Segregation**: Specific repository interfaces
5. **Dependency Inversion**: Dependencies injected via constructors

## 📄 License
MIT
