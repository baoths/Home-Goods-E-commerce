# 🎯 GETTING STARTED

## Bạn mới clone project này? Làm theo 3 bước:

### 1️⃣ Lấy NeonDB Connection String
```bash
# Truy cập: https://neon.tech
# Đăng ký tài khoản miễn phí
# Tạo project mới → Copy connection string
# Ví dụ: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
```

### 2️⃣ Setup Environment Variables
```bash
# Backend
cd backend
copy .env.example .env
# Mở .env, paste DATABASE_URL vào

# Frontend  
cd frontend
copy .env.example .env
# Mở .env, paste DATABASE_URL vào
```

### 3️⃣ Install & Run
```powershell
# Terminal 1 - Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

### ✅ Done!
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs
- Login: `admin@homegoods.com` / `password123`

---

## 📖 Đọc Thêm
- [QUICK_START.md](QUICK_START.md) - Hướng dẫn nhanh
- [ARCHITECTURE.md](ARCHITECTURE.md) - Hiểu về Clean Architecture
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Tổng kết features

Happy coding! 🚀
