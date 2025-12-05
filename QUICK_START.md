# ⚡ Quick Start Guide

## 🚀 Chạy Nhanh Project (5 phút)

### 1. Setup Database (NeonDB)
```bash
# Đăng ký tài khoản NeonDB miễn phí: https://neon.tech
# Copy connection string, ví dụ:
# postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. Setup Backend
```powershell
# Terminal 1
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Copy .env.example thành .env và điền DATABASE_URL
copy .env.example .env
# Sửa file .env, paste DATABASE_URL từ NeonDB
```

### 3. Setup Frontend  
```powershell
# Terminal 2
cd frontend
npm install

# Copy .env.example thành .env và điền DATABASE_URL
copy .env.example .env
# Sửa file .env, paste DATABASE_URL từ NeonDB

# Generate Prisma client và seed database
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Chạy Ứng Dụng
```powershell
# Terminal 1 - Backend
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Test
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Test login: `admin@homegoods.com` / `password123`

---

## 🎯 Test Features Nhanh

### Test Upload Product Image (Admin)
1. Mở http://localhost:3000/admin/products/create
2. Điền form sản phẩm
3. Chọn ảnh chính → **Tự động chuyển sang Base64**
4. Chọn nhiều ảnh gallery → **Array of Base64**
5. Submit (check console log để xem base64)

### Test Update Avatar (User)
1. Mở http://localhost:3000/profile
2. Click vào avatar icon
3. Chọn ảnh mới → **Tự động compress + Base64**
4. Submit (check console log)

---

## 📁 File Quan Trọng

| File | Mô tả |
|------|-------|
| `README.md` | Tổng quan project |
| `SETUP_GUIDE.md` | Hướng dẫn setup chi tiết |
| `ARCHITECTURE.md` | Kiến trúc & SOLID principles |
| `QUICK_START.md` | File này - Chạy nhanh |

---

## 🧩 Cấu Trúc Tóm Tắt

```
backend/
  domain/          → Entities & Interfaces (SOLID)
  application/     → Use Cases (Business Logic)
  infrastructure/  → Utils (Image, Password, JWT)
  main.py         → FastAPI app

frontend/
  app/            → Next.js pages
  lib/            → Utilities (Prisma, Image)
  prisma/         → Schema & Seed data
```

---

## 🔥 Features Chính

✅ **Clean Architecture** với 4 layers  
✅ **SOLID Principles** đầy đủ  
✅ **Image → Base64** conversion (Backend + Frontend)  
✅ **Mock Data** đầy đủ để test  
✅ **NeonDB** (PostgreSQL cloud)  
✅ **Prisma ORM** với TypeScript  
✅ **FastAPI** + **Next.js 14**  

---

## 🐛 Lỗi Thường Gặp

### ❌ Frontend: Cannot find module 'next' / 'react'
```bash
cd frontend
npm install
# Nếu vẫn lỗi:
rm -r node_modules; rm package-lock.json; npm install
```

### ❌ Frontend: Prisma Client Error
```bash
cd frontend
npx prisma generate
```

### ❌ Frontend: TypeScript errors về React/JSX
```bash
cd frontend
npm install --save-dev @types/react @types/react-dom @types/node
```

### ❌ Database Connection Failed
- Check DATABASE_URL trong .env
- Verify NeonDB connection string
- Chạy lại `npx prisma db push`

### ❌ Backend: Module Not Found (Python)
```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### ❌ Port Already in Use
```bash
# Thay đổi port trong command:
uvicorn main:app --reload --port 8001
npm run dev -- -p 3001
```

**Chi tiết hơn**: Xem `frontend/TROUBLESHOOTING.md`

---

## 📚 Đọc Thêm

- **Clean Architecture**: ARCHITECTURE.md
- **Setup Chi Tiết**: SETUP_GUIDE.md  
- **FastAPI Docs**: http://localhost:8000/docs
- **Prisma Docs**: https://prisma.io/docs

---

**Chúc bạn code vui! 🎉**
