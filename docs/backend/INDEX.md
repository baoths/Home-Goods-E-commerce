# Backend Documentation

Tài liệu hướng dẫn cho phần Backend (FastAPI + Clean Architecture)

## 📚 Danh sách tài liệu

### Architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Deep dive vào Clean Architecture
- **[CLEAN_ARCHITECTURE_EXPLAINED.md](./CLEAN_ARCHITECTURE_EXPLAINED.md)** - Giải thích Clean Architecture cho người mới

### Scripts
- **[setup.ps1](./setup.ps1)** - Script tự động setup backend

## 🏗️ Clean Architecture Layers

### 1. Domain Layer (`backend/domain/`)
- **entities.py** - Các entity nghiệp vụ (User, Product, Category, Banner, Order, OrderItem)
- **repositories.py** - Repository interfaces (DIP - Dependency Inversion Principle)

### 2. Application Layer (`backend/application/`)
- **use_cases.py** - Business logic (SRP - Single Responsibility Principle)
- **dto.py** - Data Transfer Objects

### 3. Infrastructure Layer (`backend/infrastructure/`)
- **utils/image_utils.py** - Xử lý ảnh và chuyển đổi Base64
- **utils/password_utils.py** - Hash password với bcrypt
- **utils/jwt_utils.py** - Xử lý JWT tokens

### 4. Presentation Layer (`backend/presentation/`)
- API routes (cần implement)

## 🚀 Quick Start

### Bước 1: Setup môi trường
```powershell
cd backend
.\docs\backend\setup.ps1
```

Hoặc chạy thủ công:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Bước 2: Cấu hình
```powershell
# Copy file .env.example
copy .env.example .env

# Chỉnh sửa .env với thông tin của bạn
```

### Bước 3: Chạy server
```powershell
uvicorn main:app --reload
```

API sẽ chạy tại http://localhost:8000
Swagger docs: http://localhost:8000/docs

## 🎯 SOLID Principles

Project này tuân thủ đầy đủ các nguyên tắc SOLID:

- **S**ingle Responsibility - Mỗi class chỉ có 1 trách nhiệm
- **O**pen/Closed - Mở cho mở rộng, đóng cho sửa đổi
- **L**iskov Substitution - Interface và abstract class
- **I**nterface Segregation - Repository interfaces nhỏ gọn
- **D**ependency Inversion - Phụ thuộc vào abstraction

## 📖 Đọc thêm

- Quay lại [Documentation chính](../../README.md)
- Xem [Frontend Documentation](../frontend/INDEX.md)
