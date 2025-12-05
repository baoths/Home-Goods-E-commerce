# Frontend Documentation

Tài liệu hướng dẫn cho phần Frontend (Next.js)

## 📚 Danh sách tài liệu

### Quick Fix
- **[FIX-ERRORS.md](./FIX-ERRORS.md)** - Hướng dẫn fix lỗi nhanh trong 3 bước
- **[ERRORS_EXPLAINED.md](./ERRORS_EXPLAINED.md)** - Giải thích chi tiết về các lỗi TypeScript và cách fix

### Setup & Troubleshooting
- **[README.md](./README.md)** - Tổng quan về Frontend
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Hướng dẫn xử lý các lỗi phổ biến

### Scripts
- **[fix-errors.ps1](./fix-errors.ps1)** - Script tự động fix lỗi frontend
- **[setup.ps1](./setup.ps1)** - Script tự động setup frontend

## 🚀 Quick Start

### Bước 1: Fix lỗi TypeScript
```powershell
cd frontend
.\docs\frontend\fix-errors.ps1
```

Hoặc chạy thủ công:
```powershell
cd frontend
npm install
npx prisma generate
```

### Bước 2: Cấu hình Database
```powershell
# Copy file .env.example
copy .env.example .env

# Thêm DATABASE_URL vào .env
# DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### Bước 3: Setup Database
```powershell
npx prisma db push
npm run prisma:seed
```

### Bước 4: Chạy Dev Server
```powershell
npm run dev
```

Mở http://localhost:3000

## 📖 Đọc thêm

- Quay lại [Documentation chính](../../README.md)
- Xem [Backend Documentation](../backend/INDEX.md)
