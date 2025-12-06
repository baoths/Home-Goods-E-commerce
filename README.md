# 🏠 Home Goods E-commerce

> **100% Vibe Coded** ✨  
> *Copilot Models: Gemini Pro 2.5, Claude Opus 4.5*
> *Prompted by: baoths*
---

## �️ Tech Stack

| Backend | Frontend | Database |
|---------|----------|----------|
| Next.js 14 | Flask | PostgreSQL |
| Prisma ORM | Jinja2 | NeonDB |
| JWT Auth | Alpine.js | |
| | Tailwind CSS | |
| | Cropper.js | |

## 📐 Design Patterns & Principles

- **MVC Pattern** - Model-View-Controller architecture
- **Repository Pattern** - Data access abstraction via Prisma
- **Decorator Pattern** - Route protection (`@admin_required`)
- **Proxy Pattern** - API proxy for frontend-backend communication
- **DRY** - Don't Repeat Yourself
- **SOLID** - Single responsibility in services/controllers

---

## � About

A full-stack e-commerce platform for home goods featuring product management, user authentication, and an admin dashboard with image cropping capabilities.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/baoths/Home-Goods-E-commerce.git
cd Home-Goods-E-commerce

# Backend
cd backend
pnpm install && pnpm prisma generate && pnpm prisma db push

# Frontend
cd ../frontend_python
pip install -r requirements.txt

# Run (2 terminals)
# Terminal 1: cd backend && pnpm dev
# Terminal 2: cd frontend_python && python app.py
```

**URLs:** Frontend → http://localhost:5001 | API → http://localhost:3000

---

## ✨ Features

- [x] 🔐 User authentication (Login/Register)
- [x] 👤 User profile with avatar upload
- [x] 📦 Product browsing & detail pages
- [x] 🏷️ Category filtering
- [x] 🖼️ Banner management
- [x] 🔍 Product search
- [x] 👨‍💼 Admin dashboard
- [x] ✏️ CRUD Products (with image cropper)
- [x] ✏️ CRUD Categories (with image cropper)
- [x] ✏️ CRUD Banners (with image cropper)
- [x] ✏️ User management
- [ ] 🛒 Shopping cart
- [ ] 📋 Order management

---

## 📁 Project Structure

```
Home-Goods-E-commerce/
├── .env.example
├── README.md
├── backend/
│   ├── app/
│   │   └── api/
│   │       ├── auth/
│   │       ├── products/
│   │       ├── categories/
│   │       ├── banners/
│   │       └── users/
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── banners/
│   │   └── users/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
└── frontend_python/
    ├── app.py
    ├── requirements.txt
    └── templates/
        ├── layout.html
        ├── index.html
        ├── login.html
        ├── register.html
        ├── profile.html
        ├── category.html
        ├── product_detail.html
        ├── admin.html
        ├── admin_products.html
        ├── admin_categories.html
        ├── admin_banners.html
        └── admin_users.html
```

---

## � API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Get product detail |
| GET | `/api/categories` | List categories |
| GET | `/api/banners` | List active banners |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

### Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PUT/DELETE | `/api/products/:id` | Manage products |
| POST/PUT/DELETE | `/api/categories/:id` | Manage categories |
| POST/PUT/DELETE | `/api/banners/:id` | Manage banners |
| GET/PUT/DELETE | `/api/users/:id` | Manage users |

---

## 🤝 Contributing

1. Fork it
2. Create your branch (`git checkout -b feature/cool-feature`)
3. Commit (`git commit -m 'Add cool feature'`)
4. Push (`git push origin feature/cool-feature`)
5. Open a PR

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

