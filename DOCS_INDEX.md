# 📚 Documentation Index

Chào mừng đến với project **Home Goods E-commerce**! Đây là hệ thống bán hàng đồ gia dụng được xây dựng với **Clean Architecture** và **SOLID Principles**.

## 🎯 Bắt đầu nhanh

| # | Document | Mô tả | Thời gian |
|---|----------|-------|-----------|
| 1 | [GETTING_STARTED.md](GETTING_STARTED.md) | **BẮT ĐẦU TẠI ĐÂY** - 3 bước cơ bản | 2 phút |
| 2 | [QUICK_START.md](QUICK_START.md) | Chạy nhanh project | 5 phút |
| 3 | [SETUP_GUIDE.md](SETUP_GUIDE.md) | Hướng dẫn setup chi tiết | 10 phút |

## 📖 Tìm hiểu sâu

| Document | Nội dung | Dành cho |
|----------|----------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Kiến trúc Clean Architecture, SOLID Principles, Design Patterns | Developers muốn hiểu cấu trúc |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Tổng kết features, tech stack, stats | Overview toàn bộ project |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Hướng dẫn deploy lên production | DevOps, deployment |

## 🏗️ Kiến trúc

```
Project sử dụng Clean Architecture với 4 layers:

┌─────────────────────────────────────────────┐
│         PRESENTATION LAYER                  │  ← API Routes (FastAPI)
│         (main.py, routes/)                  │
├─────────────────────────────────────────────┤
│         APPLICATION LAYER                   │  ← Use Cases, Business Logic
│         (use_cases.py, dto.py)              │
├─────────────────────────────────────────────┤
│         INFRASTRUCTURE LAYER                │  ← Database, External Services
│         (repositories/, utils/)             │
├─────────────────────────────────────────────┤
│         DOMAIN LAYER                        │  ← Entities, Business Rules
│         (entities.py, repositories.py)      │
└─────────────────────────────────────────────┘
```

## 🎓 SOLID Principles

| Principle | Áp dụng trong project |
|-----------|----------------------|
| **S**ingle Responsibility | Mỗi use case làm 1 việc |
| **O**pen/Closed | Entities mở rộng qua inheritance |
| **L**iskov Substitution | Repository implementations |
| **I**nterface Segregation | Specific repository interfaces |
| **D**ependency Inversion | Use cases → Interfaces ← Implementations |

Chi tiết: [ARCHITECTURE.md](ARCHITECTURE.md)

## 🖼️ Image to Base64 Feature

Project có tính năng **chuyển đổi ảnh sang Base64** khi upload:

**Backend**: `infrastructure/utils/image_utils.py`
- Validate, compress, convert images

**Frontend**: `lib/image.ts`  
- Client-side compression & conversion

**Sử dụng trong**:
- ✅ Product images (main + gallery)
- ✅ Banner images
- ✅ User/Admin avatars
- ✅ Category images

Chi tiết: [ARCHITECTURE.md#image-to-base64](ARCHITECTURE.md)

## 🗄️ Database

**Schema**: 8 models với Prisma ORM
- User, Category, Product, Banner, Order, OrderItem

**Database**: NeonDB (PostgreSQL serverless)

**Mock Data**: Đầy đủ data test
- 3 users (1 admin, 2 customers)
- 4 categories
- 9 products
- 3 banners
- 2 sample orders

Chi tiết: [SETUP_GUIDE.md#database](SETUP_GUIDE.md)

## 🔧 Tech Stack

### Backend
- Python 3.10+
- FastAPI
- Pydantic
- Pillow (image processing)
- JWT authentication
- bcrypt password hashing

### Frontend
- Next.js 14
- TypeScript
- Prisma Client
- TailwindCSS

### Database
- NeonDB (PostgreSQL)
- Prisma ORM

## 📊 Project Stats

- **Total Files**: 50+
- **Lines of Code**: 3,500+
- **Entities**: 6
- **Use Cases**: 10+
- **API Endpoints**: Planning
- **Frontend Pages**: 3 (more coming)

## 🎯 Features

### ✅ Đã hoàn thành
- Clean Architecture structure
- SOLID Principles implementation
- Image to Base64 conversion (Backend + Frontend)
- Database schema với Prisma
- Mock data seeding
- Authentication utilities (JWT, Password)
- Sample pages (Homepage, Admin Create Product, Profile)

### 🚧 Đang phát triển
- API routes implementation
- Repository implementations
- Authentication middleware
- Product listing & detail pages
- Shopping cart
- Checkout flow
- Admin dashboard

## 📞 Quick Links

| Resource | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| NeonDB Console | https://console.neon.tech |

## 🆘 Cần trợ giúp?

1. **Setup Issues** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **Architecture Questions** → [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Quick Troubleshooting** → [QUICK_START.md#troubleshooting](QUICK_START.md)

## 🎉 Bắt đầu ngay!

```bash
# Clone project (nếu chưa có)
git clone <your-repo>

# Follow getting started
cat GETTING_STARTED.md

# Or quick start
cat QUICK_START.md
```

---

**Happy Coding! 🚀**

*Built with Clean Architecture & SOLID Principles*
