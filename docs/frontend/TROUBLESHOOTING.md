# 🔧 TROUBLESHOOTING - Sửa Lỗi Frontend

## ❌ Các Lỗi Thường Gặp

### 1. Cannot find module 'next' / 'react' / '@prisma/client'

**Nguyên nhân**: Chưa cài đặt dependencies

**Giải pháp**:
```bash
cd frontend
npm install
```

Nếu vẫn lỗi, xóa và cài lại:
```bash
# Windows PowerShell
rm -r node_modules
rm package-lock.json
npm install
```

### 2. Cannot find namespace 'React' / JSX element errors

**Nguyên nhân**: Chưa có @types/react hoặc TypeScript chưa nhận diện

**Giải pháp**:
```bash
cd frontend
npm install --save-dev @types/react @types/react-dom @types/node
npx tsc --noEmit  # Kiểm tra TypeScript
```

### 3. Prisma Client not generated

**Nguyên nhân**: Chưa generate Prisma client

**Giải pháp**:
```bash
cd frontend
npx prisma generate
```

### 4. Database connection error

**Nguyên nhân**: Chưa có DATABASE_URL trong .env

**Giải pháp**:
```bash
# 1. Copy .env.example
cd frontend
copy .env.example .env

# 2. Lấy DATABASE_URL từ NeonDB
# Truy cập: https://console.neon.tech
# Copy connection string
# Paste vào .env

# 3. Push schema to database
npx prisma db push
```

### 5. Module parse failed / Unexpected token

**Nguyên nhân**: TypeScript config sai hoặc Next.js chưa được config đúng

**Giải pháp**:
Kiểm tra file `tsconfig.json` có đúng config không (đã có sẵn trong project)

### 6. Tailwind CSS not working

**Nguyên nhân**: Chưa import globals.css hoặc config sai

**Giải pháp**:
- Đã có `app/globals.css` import Tailwind
- Đã có `tailwind.config.js`
- Restart dev server: `npm run dev`

---

## ✅ Quy Trình Sửa Lỗi Đầy Đủ

### Bước 1: Cài đặt dependencies
```bash
cd frontend

# Cài packages
npm install

# Nếu gặp lỗi về peer dependencies
npm install --legacy-peer-deps
```

### Bước 2: Setup Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Tạo .env file
copy .env.example .env

# Chỉnh sửa .env, thêm DATABASE_URL từ NeonDB
# DATABASE_URL="postgresql://..."

# Push schema to database
npx prisma db push

# Seed mock data
npm run prisma:seed
```

### Bước 3: Kiểm tra TypeScript
```bash
# Check TypeScript errors
npx tsc --noEmit

# Nếu có lỗi về types, cài thêm
npm install --save-dev @types/node @types/react @types/react-dom
```

### Bước 4: Chạy dev server
```bash
npm run dev
```

---

## 🔍 Debug Checklist

Khi gặp lỗi, check theo thứ tự:

- [ ] `node_modules/` folder có tồn tại không?
- [ ] `package-lock.json` có tồn tại không?
- [ ] `.env` file có DATABASE_URL chưa?
- [ ] `node_modules/.prisma/client/` có tồn tại không?
- [ ] Terminal có báo lỗi cụ thể gì?
- [ ] Browser console có lỗi gì?

---

## 💡 Tips

### Clear Cache & Reinstall
```bash
# Xóa tất cả cache
rm -r node_modules
rm -r .next
rm package-lock.json

# Cài lại
npm install
npm run dev
```

### Restart VS Code
Đôi khi TypeScript server cần restart:
1. Ctrl+Shift+P
2. Gõ: "TypeScript: Restart TS Server"
3. Enter

### Port đã được sử dụng
```bash
# Đổi port khi chạy
npm run dev -- -p 3001

# Hoặc kill process đang dùng port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📞 Vẫn Gặp Lỗi?

1. **Check QUICK_START.md** - Hướng dẫn setup từ đầu
2. **Check package.json** - Đảm bảo có đủ dependencies
3. **Delete node_modules** và cài lại
4. **Check Node.js version**: `node -v` (cần >= 18)
5. **Check npm version**: `npm -v` (cần >= 9)

---

## 🎯 Expected Dependencies

File `package.json` cần có:
```json
{
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/bcryptjs": "^2.4.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "prisma": "^5.7.1",
    "tailwindcss": "^3.3.6",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

---

**Sau khi sửa xong, code sẽ chạy không lỗi! ✅**
