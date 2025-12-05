# Deploy Home Goods E-commerce lên Vercel

## 📋 Yêu cầu

- Tài khoản GitHub
- Tài khoản Vercel (miễn phí)
- Database PostgreSQL (NeonDB - miễn phí)
- Code đã push lên GitHub repository

## 🚀 Các bước Deploy

### Bước 1: Chuẩn bị Database (NeonDB)

#### 1.1 Tạo Database trên Neon

1. Truy cập https://neon.tech
2. Đăng ký/Đăng nhập
3. Click "Create Project"
4. Chọn:
   - Project name: `home-goods-ecommerce`
   - Region: Gần với user của bạn
   - Postgres version: 15 hoặc cao hơn
5. Click "Create Project"

#### 1.2 Lấy Connection String

```
Sau khi tạo project, copy connection string:

postgresql://[user]:[password]@[host]/[database]?sslmode=require

Ví dụ:
postgresql://neondb_owner:AbCxYz123@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Lưu lại connection string này** - sẽ dùng ở bước 3.

### Bước 2: Chuẩn bị Code

#### 2.1 Kiểm tra file cấu hình

Đảm bảo có file `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

**Quan trọng**: `prisma generate` phải chạy trước `next build`

#### 2.2 Tạo file `.vercelignore` (Optional)

```
# frontend/.vercelignore
node_modules
.next
.env.local
```

#### 2.3 Push code lên GitHub

```bash
# Nếu chưa init git
git init
git add .
git commit -m "Ready for deployment"

# Tạo repo trên GitHub rồi:
git remote add origin https://github.com/your-username/home-goods-ecommerce.git
git branch -M main
git push -u origin main
```

### Bước 3: Deploy lên Vercel

#### 3.1 Import Project

1. Truy cập https://vercel.com
2. Đăng nhập với GitHub
3. Click "Add New" → "Project"
4. Chọn repository: `home-goods-ecommerce`
5. Click "Import"

#### 3.2 Cấu hình Project

**Framework Preset**: Next.js (auto-detect)

**Root Directory**: `frontend` (QUAN TRỌNG!)
- Click "Edit" bên cạnh Root Directory
- Nhập: `frontend`

**Build & Development Settings**:
```
Build Command: npm run build
Output Directory: .next (default)
Install Command: npm install
Development Command: npm run dev
```

#### 3.3 Environment Variables

Click "Environment Variables" và thêm:

1. **DATABASE_URL**
   ```
   Value: postgresql://neondb_owner:AbCxYz123@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   - Environments: Production, Preview, Development (chọn tất cả)

2. **JWT_SECRET**
   ```
   Value: your-super-secret-jwt-key-change-in-production-min-32-characters
   ```
   - Generate random: https://randomkeygen.com/
   - Environments: Production, Preview, Development

Ví dụ:
```
DATABASE_URL = postgresql://neondb_owner:npg_xy09tqmCekiH@ep-super-wave-afkmj9bm-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET = 8f3e9d2c1a7b5f4e6d8c9a3b2e1f7d5c4b6a8e9f2d1c3b5a7e9f1d3c5b7a9e1f3
```

#### 3.4 Deploy

1. Click "Deploy"
2. Đợi build process (2-5 phút)
3. Xem logs để tracking progress

**Build Process:**
```
Installing dependencies...
Running "npm install"
✓ Dependencies installed

Running build command...
Running "npm run build"
├─ Generating Prisma Client...
├─ Building Next.js app...
├─ Compiling pages...
├─ Optimizing production build...
✓ Build completed

Deploying...
✓ Deployment ready
```

### Bước 4: Setup Database Schema

Sau khi deploy thành công, cần push schema lên database:

#### Option 1: Từ Local Machine

```bash
cd frontend

# Set DATABASE_URL từ Neon
$env:DATABASE_URL="postgresql://neondb_owner:...@ep-xxx.neon.tech/neondb?sslmode=require"

# Push schema
npx prisma db push

# (Optional) Seed data
npx prisma db seed
```

#### Option 2: Từ Vercel Dashboard

1. Vào project dashboard
2. Tab "Settings" → "Environment Variables"
3. Verify DATABASE_URL đã set đúng
4. Tab "Deployments" → Latest deployment → "..." menu → "Redeploy"
5. Check "Use existing Build Cache" = OFF
6. Click "Redeploy"

### Bước 5: Verify Deployment

#### 5.1 Check Website

```
URL: https://your-project-name.vercel.app

Test:
✓ Homepage loads
✓ Products hiển thị
✓ Images load (Base64)
✓ Navigation works
✓ Login/Register works
```

#### 5.2 Check Database

```bash
# Connect to Neon database
npx prisma studio

# Hoặc dùng Neon Dashboard
https://console.neon.tech → Your project → Tables
```

Verify tables:
- ✓ User
- ✓ Category  
- ✓ Product
- ✓ Order
- ✓ OrderItem

#### 5.3 Test API Endpoints

```bash
# Get products
curl https://your-project.vercel.app/api/products

# Get categories
curl https://your-project.vercel.app/api/categories

# Register
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Bước 6: Custom Domain (Optional)

#### 6.1 Add Domain

1. Vercel Dashboard → Project → "Settings" → "Domains"
2. Add your domain: `homegoods.com`
3. Follow DNS configuration instructions

#### 6.2 Configure DNS

Tại domain registrar (GoDaddy, Namecheap, etc):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 6.3 Wait for Propagation

- DNS propagation: 24-48 hours
- SSL certificate: Auto-generated by Vercel

## 🔧 Troubleshooting

### Build Failed: Prisma Error

**Error:**
```
Error: @prisma/client did not initialize yet
```

**Fix:**
```json
// package.json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Error

**Error:**
```
PrismaClientInitializationError: Can't reach database server
```

**Fix:**
1. Check DATABASE_URL format
2. Ensure `?sslmode=require` at end
3. Verify Neon database is running
4. Check IP allowlist on Neon (should allow all)

### 404 on API Routes

**Error:**
```
GET /api/products → 404
```

**Fix:**
1. Verify Root Directory = `frontend`
2. Check file structure: `frontend/app/api/products/route.ts`
3. Redeploy with "Use existing Build Cache" = OFF

### Environment Variables Not Working

**Error:**
```
process.env.JWT_SECRET is undefined
```

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Re-add variables
3. Select all environments (Production, Preview, Development)
4. Redeploy

### Images Not Loading

**Error:**
```
Images show broken icon
```

**Fix:**
1. Check Base64 format: `data:image/png;base64,...`
2. Verify image size < 3MB
3. Check browser console for errors
4. Try different image format (JPEG/PNG)

## 📊 Post-Deployment Checklist

### Security
- [ ] Environment variables set correctly
- [ ] JWT_SECRET is strong and unique
- [ ] DATABASE_URL không expose publicly
- [ ] CORS configured properly
- [ ] Password hashing works (bcrypt)

### Functionality
- [ ] Homepage loads
- [ ] Products display
- [ ] Categories work
- [ ] Search works
- [ ] Login/Register works
- [ ] Admin dashboard accessible
- [ ] CRUD operations work
- [ ] Images upload/display

### Performance
- [ ] Page load < 3s
- [ ] Lighthouse score > 80
- [ ] Images optimized
- [ ] Database queries optimized
- [ ] No console errors

### Database
- [ ] Schema pushed
- [ ] Tables created
- [ ] Seed data added (optional)
- [ ] Backups enabled
- [ ] Monitoring setup

## 🎯 Deployment URLs

After deployment:

```
Production: https://your-project.vercel.app
Preview: https://your-project-git-branch.vercel.app (per branch)
Local: http://localhost:3000
```

## 📝 Continuous Deployment

Vercel auto-deploys khi:
- ✓ Push to `main` branch → Production
- ✓ Push to other branches → Preview deployment
- ✓ Pull request → Preview deployment

## 🔄 Update Deployment

### Code Changes
```bash
git add .
git commit -m "Update feature"
git push origin main
```
→ Vercel auto-deploys

### Environment Variables Changes
1. Vercel Dashboard → Settings → Environment Variables
2. Update variable
3. Click "Save"
4. Redeploy required

### Database Schema Changes
```bash
# Update schema.prisma
# Then:
npx prisma db push

# Vercel sẽ tự chạy prisma generate khi deploy
```

## 💰 Pricing

### Vercel (Hobby Plan - FREE)
- ✓ Unlimited deployments
- ✓ 100GB bandwidth/month
- ✓ SSL certificates
- ✓ Custom domains
- ✓ Automatic HTTPS

### NeonDB (Free Tier)
- ✓ 0.5 GB storage
- ✓ 1 project
- ✓ Unlimited queries
- ✓ Automatic backups (7 days)

**Total cost: $0/month** cho hobby projects

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Neon Console: https://console.neon.tech
- Next.js Deploy Docs: https://nextjs.org/docs/deployment
- Prisma Deploy Docs: https://www.prisma.io/docs/guides/deployment

## 📞 Support

- Vercel Support: https://vercel.com/support
- Neon Discord: https://discord.gg/neon
- Next.js Discord: https://discord.gg/nextjs

---

**🎉 Chúc mừng! Website của bạn đã live trên Vercel!**
