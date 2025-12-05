# Backend API - Python FastAPI

Backend API cho Home Goods E-commerce sử dụng FastAPI và SQLAlchemy, tương thích với database Prisma của frontend.

## 🏗️ Kiến trúc

- **Framework**: FastAPI
- **Database**: PostgreSQL (NeonDB)
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Architecture**: Clean Architecture pattern

## 📁 Cấu trúc thư mục

```
backend/
├── domain/              # Domain Layer - Business logic & entities
├── application/         # Application Layer - Use cases & DTOs
├── infrastructure/      # Infrastructure Layer - Database, external services
│   ├── database/       # SQLAlchemy models & connection
│   └── utils/          # JWT, password hashing
├── presentation/        # Presentation Layer - API routes
│   └── api/            # REST API endpoints
├── config.py           # Configuration settings
└── main.py             # Application entry point
```

## 🚀 Setup & Chạy Backend

### 1. Tạo Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Kích hoạt Virtual Environment

**Windows PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows CMD:**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

### 4. Cấu hình Environment Variables

File `.env` đã có sẵn với cấu hình database. Nếu cần thay đổi:

```env
DATABASE_URL="postgresql://user:password@host/database"
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS="http://localhost:3000"
```

### 5. Chạy Server

```bash
# Development mode với auto-reload
uvicorn main:app --reload --port 8000

# Hoặc với host 0.0.0.0 để truy cập từ network
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại: `http://localhost:8000`

## 📚 API Documentation

Sau khi chạy server, truy cập:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại (requires auth)
- `PUT /api/auth/profile` - Cập nhật profile (requires auth)

### Products (`/api/products`)
- `GET /api/products` - Lấy danh sách sản phẩm (có pagination & filters)
- `GET /api/products/{id}` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (admin only)
- `PUT /api/products/{id}` - Cập nhật sản phẩm (admin only)
- `DELETE /api/products/{id}` - Xóa sản phẩm (admin only)

### Categories (`/api/categories`)
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/{id}` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục mới (admin only)
- `PUT /api/categories/{id}` - Cập nhật danh mục (admin only)
- `DELETE /api/categories/{id}` - Xóa danh mục (admin only)

## 🗄️ Database

Backend sử dụng cùng PostgreSQL database với frontend (qua Prisma).

### SQLAlchemy Models

Models được định nghĩa trong `infrastructure/database/models.py`:
- `User` - Người dùng
- `Category` - Danh mục sản phẩm
- `Product` - Sản phẩm
- `Order` - Đơn hàng
- `OrderItem` - Chi tiết đơn hàng

### Schema Compatibility

Backend SQLAlchemy models tương thích 100% với Prisma schema của frontend:
- Cùng tên bảng, tên cột
- Cùng kiểu dữ liệu
- Cùng relationships

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) cho authentication:

1. Login để nhận access token
2. Thêm token vào header: `Authorization: Bearer <token>`
3. Token hết hạn sau 30 phút (configurable)

## 👥 User Roles

- **CUSTOMER**: Người dùng thông thường
- **ADMIN**: Quản trị viên (full access)

## 🧪 Testing API

### Sử dụng curl

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get products
curl http://localhost:8000/api/products
```

### Sử dụng Swagger UI

Truy cập http://localhost:8000/docs để test API trực tiếp với giao diện đồ họa.

## 📦 Dependencies

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - ORM
- `psycopg2-binary` - PostgreSQL driver
- `pydantic` - Data validation
- `pydantic-settings` - Settings management
- `PyJWT` - JWT authentication
- `bcrypt` - Password hashing
- `python-multipart` - File upload support
- `python-dotenv` - Environment variables

## 🔄 Sync với Frontend

Backend được thiết kế để đồng bộ hoàn toàn với frontend Next.js:

1. **Cùng Database**: Sử dụng chung PostgreSQL database
2. **Cùng Schema**: SQLAlchemy models tương thích với Prisma schema
3. **Cùng JWT Secret**: Sử dụng chung secret key để decode tokens
4. **Compatible API**: Endpoints tương thích với frontend API client

## 🛠️ Development

### Hot Reload

Server tự động reload khi code thay đổi (với flag `--reload`)

### Debug

Thêm breakpoints và debug như Python app thông thường.

### Logs

FastAPI tự động log requests. Xem logs trong terminal.

## 🚨 Lưu ý

1. **Database**: Backend và frontend chia sẻ cùng database. Cẩn thận khi modify data.
2. **JWT Secret**: Phải giống với frontend để auth hoạt động.
3. **CORS**: Đã cấu hình cho phép frontend `localhost:3000` truy cập.
4. **Port**: Backend chạy port 8000, frontend port 3000.

## 📝 TODO

- [ ] Thêm API endpoints cho Orders
- [ ] Implement file upload cho images
- [ ] Add rate limiting
- [ ] Add request validation middleware
- [ ] Setup logging với file rotation
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Setup CI/CD
- [ ] Add API versioning

## 🤝 Contributing

1. Tạo feature branch
2. Commit changes
3. Push và tạo Pull Request

## 📄 License

MIT License
