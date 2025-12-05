# 🚀 Hướng Dẫn Setup & Chạy Project

## 📋 Yêu Cầu Hệ Thống
- Python 3.10 trở lên
- Node.js 18 trở lên
- PostgreSQL (NeonDB account)
- Git

## 🔧 Cài Đặt Chi Tiết

### 1️⃣ Clone Repository
```bash
cd d:\github_stuff\cloned_res\python\1
```

### 2️⃣ Setup Backend (Python FastAPI)

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment (Windows)
venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt

# Copy file .env.example thành .env
copy .env.example .env

# Chỉnh sửa file .env và thêm DATABASE_URL từ NeonDB
# DATABASE_URL="postgresql://user:password@your-neon-db.neon.tech/neondb?sslmode=require"
```

**Lấy DATABASE_URL từ NeonDB:**
1. Đăng nhập https://neon.tech
2. Tạo project mới hoặc chọn project có sẵn
3. Copy connection string từ Dashboard
4. Paste vào file `.env`

### 3️⃣ Setup Frontend (Next.js)

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Copy file .env.example thành .env
copy .env.example .env

# Chỉnh sửa file .env và thêm DATABASE_URL (giống backend)
```

### 4️⃣ Setup Database với Prisma

```bash
# Trong thư mục frontend
npx prisma generate
npx prisma db push

# Seed database với mock data
npm run prisma:seed
```

**Kết quả sau khi seed:**
- ✅ 3 users (1 admin, 2 customers)
- ✅ 4 categories (Nhà bếp, Nội thất, Vệ sinh, Trang trí)
- ✅ 9 products (với ảnh base64)
- ✅ 3 banners (ảnh base64)
- ✅ 2 sample orders

**Tài khoản test:**
- **Admin**: `admin@homegoods.com` / `password123`
- **Customer**: `customer1@example.com` / `password123`

## ▶️ Chạy Ứng Dụng

### Chạy Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Backend sẽ chạy tại: http://localhost:8000
API Docs: http://localhost:8000/docs

### Chạy Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 🎯 Các Tính Năng Đã Implement

### ✅ Clean Architecture (Backend)
```
backend/
├── domain/              # Business logic & entities
│   ├── entities.py     # Domain models
│   └── repositories.py # Repository interfaces
├── application/         # Use cases
│   ├── dto.py          # Data Transfer Objects
│   └── use_cases.py    # Business operations
├── infrastructure/      # External dependencies
│   └── utils/
│       ├── image_utils.py     # Image to Base64 conversion
│       ├── password_utils.py  # Password hashing
│       └── jwt_utils.py       # JWT authentication
└── main.py             # FastAPI entry point
```

### ✅ SOLID Principles Applied

1. **Single Responsibility Principle (SRP)**
   - Mỗi entity chỉ quản lý một concept
   - Mỗi use case chỉ làm một việc

2. **Open/Closed Principle (OCP)**
   - Entities có thể extend qua inheritance
   - Repository pattern cho flexibility

3. **Liskov Substitution Principle (LSP)**
   - Tất cả implementations tuân theo interfaces

4. **Interface Segregation Principle (ISP)**
   - Specific repository interfaces (IUserRepository, IProductRepository, etc.)

5. **Dependency Inversion Principle (DIP)**
   - Use cases depend on repository interfaces, not implementations

### ✅ Image to Base64 Conversion

**Backend**: `infrastructure/utils/image_utils.py`
```python
# Functions:
- image_to_base64()     # Convert image bytes to base64
- base64_to_image()     # Convert base64 to image bytes
- compress_image()      # Resize and compress
- validate_image()      # Validate file type & size
- process_upload_image() # Complete processing pipeline
```

**Frontend**: `lib/image.ts`
```typescript
// Functions:
- fileToBase64()           // File to base64
- filesToBase64Array()     // Multiple files
- compressImage()          // Compress before upload
- prepareImageForUpload()  // Validate + compress + convert
```

**Sử dụng trong:**
- ✅ Admin upload product images
- ✅ Admin update banner images
- ✅ User/Admin update avatar
- ✅ Product gallery (multiple images)

### ✅ Database Schema (Prisma)

**Tables:**
- `users` - User accounts (admin/customer)
- `categories` - Product categories
- `products` - Products with images (base64)
- `banners` - Homepage banners (base64)
- `orders` - Customer orders
- `order_items` - Order line items

**All images stored as base64 in TEXT fields**

## 🧪 Testing

### Test Upload Image
1. Chạy frontend: http://localhost:3000
2. Vào `/admin/products/create`
3. Upload ảnh sản phẩm → tự động chuyển sang base64
4. Upload nhiều ảnh gallery → array of base64

### Test Update Avatar
1. Vào `/profile`
2. Click vào avatar
3. Upload ảnh mới → tự động compress và convert base64
4. Check console log để xem base64 string

## 📝 Next Steps (Để Hoàn Thiện)

### Backend cần thêm:
- [ ] Implement Prisma repository (infrastructure layer)
- [ ] Create API routes (presentation layer)
- [ ] Add authentication middleware
- [ ] Error handling & validation

### Frontend cần thêm:
- [ ] API integration với backend
- [ ] Authentication context
- [ ] Product listing pages
- [ ] Shopping cart functionality
- [ ] Checkout flow

## 🔒 Bảo Mật

- Passwords được hash với bcrypt
- JWT tokens cho authentication
- CORS configured
- Input validation với Pydantic & Zod
- Image size limits (5MB default)

## 📚 Tech Stack Summary

**Backend:**
- FastAPI (Python web framework)
- Pydantic (Data validation)
- Prisma (ORM - optional, có thể dùng SQLAlchemy)
- Pillow (Image processing)
- JWT (Authentication)

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Prisma Client
- TailwindCSS (Styling)

**Database:**
- NeonDB (PostgreSQL)
- Prisma Schema

## 🐛 Troubleshooting

### Lỗi: Prisma Client not generated
```bash
cd frontend
npx prisma generate
```

### Lỗi: Module not found (Python)
```bash
cd backend
pip install -r requirements.txt
```

### Lỗi: Database connection
- Check DATABASE_URL trong .env
- Verify NeonDB connection string
- Run `npx prisma db push` again

## 📞 Support

Nếu gặp vấn đề:
1. Check terminal logs
2. Verify .env files
3. Re-run prisma generate
4. Clear node_modules và reinstall

---

**Project Structure tạo thành công! 🎉**

Kiến trúc Clean Architecture + SOLID đã được áp dụng đúng chuẩn.
Tất cả images đều được convert sang Base64 khi upload.
