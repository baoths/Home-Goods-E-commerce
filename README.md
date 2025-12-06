# Home Goods E-commerce# 🏠 Home Goods E-commerce



This is a full-stack e-commerce web application for home goods, built with Next.js, TypeScript, and Prisma.Website bán đồ gia dụng online với Clean Architecture và SOLID principles.



## ✨ Features## 📋 Giới thiệu



- User authentication (Register, Login)Dự án fullstack e-commerce:

- Product browsing by category- **Frontend**: Next.js 14 + TypeScript + TailwindCSS

- Product search- **Backend**: Python FastAPI với Clean Architecture (Optional)

- Shopping cart- **Database**: PostgreSQL (NeonDB) với Prisma ORM

- User profile management- **Authentication**: JWT-based auth

- Admin dashboard for managing products, categories, and users- **State Management**: React Hooks + localStorage



## 🚀 Technologies Used## ✨ Tính năng



- **Framework**: [Next.js](https://nextjs.org/)### 🛍️ Người dùng

- **Language**: [TypeScript](https://www.typescriptlang.org/)- ✅ Đăng ký/Đăng nhập với JWT authentication

- **Styling**: [Tailwind CSS](https://tailwindcss.com/)- ✅ Xem danh sách sản phẩm với pagination & filters

- **ORM**: [Prisma](https://www.prisma.io/)- ✅ Tìm kiếm sản phẩm

- **Database**: [PostgreSQL](https://www.postgresql.org/) (or any other Prisma-supported database)- ✅ Xem chi tiết sản phẩm với gallery hình ảnh

- ✅ Lọc sản phẩm theo category

## 📦 Getting Started- ✅ Sắp xếp sản phẩm (mới nhất, giá, tên)

- ✅ Cập nhật profile với avatar upload (Base64)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.- ✅ Responsive design



### Prerequisites### 👨‍💼 Admin

- ✅ Dashboard thống kê (sản phẩm, categories, users, orders)

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)- ✅ Quản lý sản phẩm (CRUD)

- [pnpm](https://pnpm.io/installation) (or npm/yarn)  - Thêm/sửa/xóa sản phẩm

- A running PostgreSQL database instance.  - Upload hình ảnh (single + multiple images)

  - Quản lý stock, giá, discount

### Installation & Setup- ✅ Quản lý categories (CRUD)

- ✅ Quản lý users (view, edit, delete)

1.  **Clone the repository:**- ✅ Role-based access control

    ```bash

    git clone https://github.com/baoths/Home-Goods-E-commerce.git## 🚀 Quick Start

    cd Home-Goods-E-commerce/frontend

    ```### 1. Clone Repository



2.  **Install dependencies:**```bash

    ```bashgit clone <repository-url>

    pnpm installcd Home-Goods-E-commerce

    ``````



3.  **Set up environment variables:**### 2. Setup Frontend



    Create a `.env` file in the `frontend` directory by copying the example file:```bash

    ```bashcd frontend

    cp .env.example .envnpm install

    ```# hoặc

pnpm install

    Open the `.env` file and update the `DATABASE_URL` with your PostgreSQL connection string. It should look something like this:```

    ```

    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"**Cấu hình database:**

    ```1. Copy `.env.example` thành `.env`

2. Cập nhật `DATABASE_URL` và `JWT_SECRET`

4.  **Apply database migrations:**

```bash

    This command will apply the database schema defined in `prisma/schema.prisma` to your database.npx prisma generate

    ```bashnpx prisma db push

    pnpm prisma db pushnpm run dev

    ``````



5.  **(Optional) Seed the database with initial data:**→ Frontend: http://localhost:3000



    If you want to populate your database with some sample data, run:### 3. Setup Backend (Optional)

    ```bash

    pnpm prisma db seedBackend Python là optional vì frontend đã có API routes riêng. Nếu muốn sử dụng:

    ```

**Windows:**

### Running the Development Server```bash

cd backend

Once the setup is complete, you can start the development server:setup.bat

start.bat

```bash```

pnpm dev

```**macOS/Linux:**

```bash

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.cd backend

chmod +x setup.sh start.sh
./setup.sh
./start.sh
```

→ Backend API: http://localhost:8000  
→ API Docs: http://localhost:8000/docs





## 🗄️ Database Schema

### Tables

- **User**: Người dùng (customers & admins)
- **Category**: Danh mục sản phẩm
- **Product**: Sản phẩm với images (Base64)
- **Order**: Đơn hàng
- **OrderItem**: Chi tiết đơn hàng

### Key Features

- ✅ PostgreSQL với Prisma ORM
- ✅ UUID primary keys
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Foreign key relationships
- ✅ Base64 image storage
- ✅ Indexes trên slug và email

## 🔐 Authentication

- **JWT-based authentication**
- Token expiration: 30 minutes
- Roles: ADMIN, CUSTOMER
- Protected routes với middleware
- Password hashing với bcrypt

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons
- Optimized images

### Image Handling
- Base64 encoding/decoding
- Image compression (800px max width)
- Multiple image support
- Gallery view với thumbnails
- Avatar upload với preview

### User Experience
- Loading states
- Error handling
- Form validation
- Toast notifications
- Smooth transitions
- Hover effects

## 🔧 Tech Stack


- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Prisma ORM
- **Auth**: JWT (jsonwebtoken)
- **Image**: Canvas API (Base64 conversion)
- **HTTP**: Fetch API


## 📝 API Endpoints

### Frontend API Routes (Next.js)

**Auth:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Current user
- `PUT /api/auth/me` - Update profile

**Products:**
- `GET /api/products` - List products
- `GET /api/products/[id]` - Product detail
- `POST /api/products` - Create (Admin)
- `PUT /api/products/[id]` - Update (Admin)
- `DELETE /api/products/[id]` - Delete (Admin)

**Categories:**
- `GET /api/categories` - List categories
- `GET /api/categories/[id]` - Category detail
- `POST /api/categories` - Create (Admin)
- `PUT /api/categories/[id]` - Update (Admin)
- `DELETE /api/categories/[id]` - Delete (Admin)

**Users:**
- `GET /api/users` - List users (Admin)
- `GET /api/users/[id]` - User detail (Admin)
- `PUT /api/users/[id]` - Update user (Admin)
- `DELETE /api/users/[id]` - Delete user (Admin)

**Admin:**
- `GET /api/admin/statistics` - Dashboard stats



### Database (NeonDB)

1. Tạo project tại neon.tech
2. Copy DATABASE_URL
3. Update .env files
4. Run `npx prisma db push`

## 🧪 Testing

```bash
# Frontend
cd frontend
npm test

# Backend  
cd backend
pytest
```

## 📚 Documentation

- See `/frontend/README.md`
- **API Docs**: http://localhost:8000/docs (when backend running)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- Backend Architecture: Clean Architecture + SOLID principles
- Frontend: Next.js 14 + TypeScript
- Database: PostgreSQL with Prisma

## 🙏 Acknowledgments

- FastAPI documentation
- Next.js documentation
- Clean Architecture by Robert C. Martin
- SOLID principles