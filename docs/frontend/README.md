# 🎨 Frontend - Next.js Application

## ⚠️ Nếu Bạn Thấy Lỗi TypeScript/Module

**Đây là BÌNH THƯỜNG!** Các lỗi sẽ biến mất sau khi cài đặt dependencies.

### 🚀 Quick Fix (3 lệnh)

```powershell
cd frontend
npm install
npx prisma generate
```

**Hoặc chạy script tự động**:
```powershell
cd frontend
.\setup.ps1
```

---

## 📋 Setup Đầy Đủ

### Bước 1: Install Dependencies
```powershell
npm install
```

### Bước 2: Setup TypeScript Types
```powershell
npm install --save-dev @types/react @types/react-dom @types/node
```

### Bước 3: Setup Database
```powershell
# Tạo .env file
copy .env.example .env

# Chỉnh sửa .env, thêm DATABASE_URL từ NeonDB
# DATABASE_URL="postgresql://..."

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed mock data
npm run prisma:seed
```

### Bước 4: Run Dev Server
```powershell
npm run dev
```

Mở: http://localhost:3000

---

## 🐛 Lỗi Phổ Biến & Cách Sửa

### ❌ Cannot find module 'next' or 'react'

**Lỗi này xuất hiện khi**:
- Chưa chạy `npm install`
- `node_modules` bị lỗi

**Sửa**:
```powershell
# Cài mới
npm install

# Hoặc cài lại từ đầu
rm -r node_modules
rm package-lock.json
npm install
```

### ❌ Cannot find module '@prisma/client'

**Sửa**:
```powershell
npx prisma generate
```

### ❌ JSX element implicitly has type 'any'

**Sửa**:
```powershell
npm install --save-dev @types/react @types/react-dom
```

### ❌ Cannot find name 'process'

**Sửa**:
```powershell
npm install --save-dev @types/node
```

### ❌ Database connection error

**Sửa**:
1. Kiểm tra file `.env` có DATABASE_URL chưa
2. DATABASE_URL phải đúng format từ NeonDB
3. Chạy lại: `npx prisma db push`

### ❌ Vẫn thấy lỗi trong VS Code

**Restart TypeScript Server**:
1. Ctrl+Shift+P
2. Gõ: "TypeScript: Restart TS Server"
3. Enter

---

## 🛠️ Scripts Hữu Ích

### Setup nhanh (tự động)
```powershell
.\setup.ps1
```

### Fix lỗi (xóa cache & cài lại)
```powershell
.\fix-errors.ps1
```

### Chạy development server
```powershell
npm run dev
```

### Build production
```powershell
npm run build
npm start
```

### Prisma commands
```powershell
# Generate client
npx prisma generate

# Update database
npx prisma db push

# Seed data
npm run prisma:seed

# Prisma Studio (database GUI)
npx prisma studio
```

---

## 📁 Cấu Trúc Frontend

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── admin/             # Admin pages
│   │   └── products/
│   │       └── create/    # Create product with image upload
│   └── profile/           # User profile with avatar upload
│
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client singleton
│   └── image.ts          # Image processing (Base64)
│
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Mock data
│
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── next.config.js        # Next.js config
├── tailwind.config.js    # TailwindCSS config
└── .env                  # Environment variables (create this!)
```

---

## 🎯 Features

### Image Upload to Base64
File: `lib/image.ts`

Functions:
- `fileToBase64()` - Convert File to Base64
- `filesToBase64Array()` - Convert multiple files
- `compressImage()` - Compress before upload
- `prepareImageForUpload()` - Complete pipeline

Usage:
```typescript
import { prepareImageForUpload } from '@/lib/image'

const result = await prepareImageForUpload(file, {
  compress: true,
  maxWidth: 1200,
  quality: 0.85
})

if (result.success) {
  const base64 = result.data // Use this
}
```

### Prisma Database
File: `lib/prisma.ts`

Usage:
```typescript
import { prisma } from '@/lib/prisma'

// Get products
const products = await prisma.product.findMany()

// Create user
const user = await prisma.user.create({
  data: { email, password, name }
})
```

---

## 📊 Mock Data (Seeded)

Sau khi chạy `npm run prisma:seed`:
- ✅ 3 users (1 admin, 2 customers)
- ✅ 4 categories
- ✅ 9 products với images (base64)
- ✅ 3 banners với images (base64)
- ✅ 2 sample orders

**Test credentials**:
- Admin: `admin@homegoods.com` / `password123`
- Customer: `customer1@example.com` / `password123`

---

## 🔗 API Integration

**Backend API**: http://localhost:8000

Example API call:
```typescript
// pages/api or Server Components
const response = await fetch('http://localhost:8000/api/products')
const products = await response.json()
```

---

## 📚 Documentation

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Sửa lỗi chi tiết
- [../QUICK_START.md](../QUICK_START.md) - Quick start guide
- [../ARCHITECTURE.md](../ARCHITECTURE.md) - Project architecture

---

## ✅ Checklist Trước Khi Code

- [ ] `npm install` đã chạy thành công
- [ ] `.env` file có DATABASE_URL
- [ ] `npx prisma generate` đã chạy
- [ ] `npx prisma db push` thành công
- [ ] `npm run prisma:seed` có data test
- [ ] `npm run dev` chạy không lỗi
- [ ] http://localhost:3000 mở được

---

**Nếu vẫn gặp vấn đề, xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md)** 🔧
