# Documentation Index

Tài liệu tổng hợp cho dự án Python E-commerce Website

## 📂 Cấu trúc Documentation

```
docs/
├── INDEX.md                    (file này)
├── setup-all.ps1              (Script setup toàn bộ project)
├── frontend/
│   ├── INDEX.md               (Mục lục Frontend)
│   ├── README.md              (Tổng quan Frontend)
│   ├── FIX-ERRORS.md          (Fix lỗi nhanh)
│   ├── ERRORS_EXPLAINED.md    (Giải thích lỗi chi tiết)
│   ├── TROUBLESHOOTING.md     (Xử lý lỗi)
│   ├── setup.ps1              (Script setup Frontend)
│   └── fix-errors.ps1         (Script fix lỗi Frontend)
└── backend/
    ├── INDEX.md               (Mục lục Backend)
    ├── ARCHITECTURE.md        (Chi tiết Architecture)
    ├── CLEAN_ARCHITECTURE_EXPLAINED.md
    └── setup.ps1              (Script setup Backend)
```

## 🚀 Quick Links

### Bắt đầu nhanh
- 📖 [GETTING_STARTED.md](../GETTING_STARTED.md) - Hướng dẫn bắt đầu trong 3 bước
- ⚡ [QUICK_START.md](../QUICK_START.md) - Setup trong 5 phút
- 📋 [CHECKLIST.md](../CHECKLIST.md) - Checklist cho developer

### Frontend
- 📘 [Frontend Documentation](./frontend/INDEX.md)
- 🔧 [Fix Frontend Errors](./frontend/FIX-ERRORS.md)
- 🎨 Next.js 14 + TypeScript + Prisma

### Backend
- 📗 [Backend Documentation](./backend/INDEX.md)
- 🏗️ [Clean Architecture](./backend/ARCHITECTURE.md)
- 🐍 FastAPI + Clean Architecture + SOLID

### Tổng quan Project
- 📊 [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) - Tổng quan toàn bộ tính năng
- 🛠️ [SETUP_GUIDE.md](../SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- 🚢 [DEPLOYMENT.md](../DEPLOYMENT.md) - Hướng dẫn deploy
- 📚 [DOCS_INDEX.md](../DOCS_INDEX.md) - Index cũ (deprecated)

## 🎯 Setup toàn bộ Project

### Option 1: Sử dụng Script (Khuyến nghị)
```powershell
.\docs\setup-all.ps1
```

### Option 2: Setup từng phần

#### Frontend
```powershell
cd frontend
.\docs\frontend\setup.ps1
```

#### Backend
```powershell
cd backend
.\docs\backend\setup.ps1
```

## 🔥 Fix lỗi nhanh

### Frontend có lỗi TypeScript?
```powershell
cd frontend
.\docs\frontend\fix-errors.ps1
```

### Đọc giải thích lỗi
- [docs/frontend/ERRORS_EXPLAINED.md](./frontend/ERRORS_EXPLAINED.md)

## 📖 Tài liệu theo chủ đề

### Architecture & Design
- [Clean Architecture Deep Dive](./backend/ARCHITECTURE.md)
- [Clean Architecture cho người mới](./backend/CLEAN_ARCHITECTURE_EXPLAINED.md)

### Troubleshooting
- [Frontend Troubleshooting](./frontend/TROUBLESHOOTING.md)
- [Frontend Error Fixes](./frontend/FIX-ERRORS.md)

### Setup & Configuration
- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/INDEX.md)

## 🎓 Học Clean Architecture

1. Đọc [CLEAN_ARCHITECTURE_EXPLAINED.md](./backend/CLEAN_ARCHITECTURE_EXPLAINED.md) - Giải thích dễ hiểu
2. Đọc [ARCHITECTURE.md](./backend/ARCHITECTURE.md) - Chi tiết kỹ thuật
3. Xem code trong `backend/` để hiểu cách implement

## 🆘 Cần giúp đỡ?

### Frontend không chạy được?
1. Đọc [FIX-ERRORS.md](./frontend/FIX-ERRORS.md)
2. Chạy script: `.\docs\frontend\fix-errors.ps1`
3. Đọc [TROUBLESHOOTING.md](./frontend/TROUBLESHOOTING.md)

### Backend không chạy được?
1. Kiểm tra Python version: `python --version` (cần 3.10+)
2. Chạy setup: `.\docs\backend\setup.ps1`
3. Kiểm tra .env file

### Database không kết nối được?
1. Kiểm tra DATABASE_URL trong .env
2. Đảm bảo NeonDB đã được tạo
3. Chạy `npx prisma db push` trong frontend

## 📞 Support

- Đọc [README.md](../README.md) chính
- Check [CHECKLIST.md](../CHECKLIST.md)
- Xem [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md)
