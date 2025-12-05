# ⚡ SỬA LỖI FRONTEND NHANH

## 🎯 Lỗi bạn đang gặp là BÌNH THƯỜNG!

Các lỗi TypeScript/Module xuất hiện vì **chưa cài đặt dependencies**.

---

## ✅ GIẢI PHÁP (Copy & Paste)

### Option 1: Chạy Script Tự Động (KHUYẾN NGHỊ)

```powershell
# Chạy từ thư mục frontend
cd frontend
.\fix-errors.ps1
```

Script sẽ:
- Xóa cache cũ
- Cài lại dependencies
- Generate Prisma client
- Check TypeScript

### Option 2: Manual (4 lệnh)

```powershell
cd frontend
npm install
npm install --save-dev @types/react @types/react-dom @types/node
npx prisma generate
```

---

## 🔄 Restart VS Code TypeScript

Sau khi cài xong, nếu vẫn thấy lỗi đỏ:

1. **Ctrl + Shift + P**
2. Gõ: `TypeScript: Restart TS Server`
3. **Enter**

Lỗi sẽ biến mất! ✨

---

## 📝 Checklist

- [ ] Đã chạy `npm install`
- [ ] Đã chạy `npx prisma generate`
- [ ] Đã restart TypeScript Server
- [ ] Đã có file `.env` với DATABASE_URL

---

## 🚀 Sau Khi Sửa Xong

```powershell
# Setup database (chỉ lần đầu)
copy .env.example .env  # Thêm DATABASE_URL vào
npx prisma db push
npm run prisma:seed

# Chạy dev server
npm run dev
```

Mở: **http://localhost:3000** 🎉

---

**Chi tiết hơn**: Xem `TROUBLESHOOTING.md` hoặc `README.md`
