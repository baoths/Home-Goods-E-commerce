# 🏗️ Project Architecture Documentation

## 📂 Cấu Trúc Project Hoàn Chỉnh

```
d:\github_stuff\cloned_res\python\1/
│
├── 📄 README.md                    # Tổng quan project
├── 📄 SETUP_GUIDE.md              # Hướng dẫn setup chi tiết
├── 📄 ARCHITECTURE.md             # File này - Kiến trúc chi tiết
│
├── 🐍 backend/                    # Python FastAPI Backend
│   ├── domain/                    # DOMAIN LAYER - Core Business Logic
│   │   ├── __init__.py
│   │   ├── entities.py           # ✅ Domain Entities (User, Product, Category, etc.)
│   │   └── repositories.py       # ✅ Repository Interfaces (SOLID: DIP)
│   │
│   ├── application/               # APPLICATION LAYER - Use Cases
│   │   ├── __init__.py
│   │   ├── dto.py                # ✅ Data Transfer Objects (Request/Response)
│   │   └── use_cases.py          # ✅ Business Logic Use Cases (SOLID: SRP)
│   │
│   ├── infrastructure/            # INFRASTRUCTURE LAYER - External Dependencies
│   │   ├── __init__.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── image_utils.py    # ✅ Image ↔ Base64 Conversion
│   │       ├── password_utils.py # ✅ Password Hashing (bcrypt)
│   │       └── jwt_utils.py      # ✅ JWT Token Management
│   │
│   ├── presentation/              # PRESENTATION LAYER - API Routes (TODO)
│   │   └── api/
│   │       └── routes/
│   │
│   ├── 📄 main.py                # ✅ FastAPI Application Entry Point
│   ├── 📄 config.py              # ✅ Configuration Settings
│   ├── 📄 requirements.txt       # ✅ Python Dependencies
│   ├── 📄 .env.example           # ✅ Environment Variables Template
│   └── 📄 .gitignore
│
├── ⚛️ frontend/                   # Next.js Frontend
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # ✅ Root Layout
│   │   ├── page.tsx             # ✅ Homepage
│   │   ├── globals.css          # ✅ Global Styles
│   │   │
│   │   ├── admin/               # Admin Dashboard
│   │   │   └── products/
│   │   │       └── create/
│   │   │           └── page.tsx # ✅ Create Product (with Base64 upload)
│   │   │
│   │   └── profile/
│   │       └── page.tsx         # ✅ User Profile (Avatar upload)
│   │
│   ├── lib/                     # Utilities & Helpers
│   │   ├── prisma.ts           # ✅ Prisma Client Singleton
│   │   └── image.ts            # ✅ Image Processing Functions
│   │
│   ├── prisma/                  # Prisma ORM
│   │   ├── schema.prisma       # ✅ Database Schema (NeonDB)
│   │   └── seed.ts             # ✅ Mock Data Seeder
│   │
│   ├── 📄 package.json          # ✅ Node Dependencies
│   ├── 📄 tsconfig.json         # ✅ TypeScript Config
│   ├── 📄 next.config.js        # ✅ Next.js Config
│   ├── 📄 tailwind.config.js    # ✅ Tailwind CSS Config
│   ├── 📄 postcss.config.js     # ✅ PostCSS Config
│   ├── 📄 .env.example          # ✅ Environment Variables
│   └── 📄 .gitignore
│
└── 📄 .env (trong .gitignore)    # Your actual environment variables
```

---

## 🎯 Clean Architecture Layers

### 1. Domain Layer (Innermost)
**Mục đích**: Core business logic, không phụ thuộc vào frameworks hay external libraries

**Files**:
- `domain/entities.py` - Business entities với business rules
- `domain/repositories.py` - Abstract repository interfaces

**Principles**:
- ✅ SRP: Mỗi entity có 1 trách nhiệm
- ✅ OCP: Open for extension (inheritance)
- ✅ DIP: Chỉ định nghĩa interfaces, không implement

**Example**:
```python
class Product:
    def get_final_price(self) -> Decimal:
        # Business rule: Calculate price after discount
        
    def is_in_stock(self) -> bool:
        # Business rule: Check availability
```

---

### 2. Application Layer
**Mục đích**: Orchestrate business logic, implement use cases

**Files**:
- `application/dto.py` - Input/Output data structures
- `application/use_cases.py` - Business operations

**Principles**:
- ✅ SRP: Mỗi use case làm 1 việc
- ✅ DIP: Depends on repository interfaces

**Example**:
```python
class CreateProductUseCase:
    def __init__(self, repository: IProductRepository):
        self.repository = repository  # DIP: Depend on interface
    
    async def execute(self, dto: ProductCreateDTO) -> Product:
        # Orchestrate: Validate → Process image → Save
```

---

### 3. Infrastructure Layer
**Mục đích**: External dependencies, framework implementations

**Files**:
- `infrastructure/utils/image_utils.py` - Image processing
- `infrastructure/utils/password_utils.py` - Security
- `infrastructure/utils/jwt_utils.py` - Authentication
- `infrastructure/database/` (TODO) - Prisma/SQLAlchemy repos

**Principles**:
- ✅ DIP: Implements repository interfaces from domain
- ✅ ISP: Specific utility functions

---

### 4. Presentation Layer
**Mục đích**: API routes, HTTP handling

**Files**:
- `presentation/api/routes/` (TODO)
- `main.py` - FastAPI app configuration

**Principles**:
- ✅ SRP: Each route handles one resource
- ✅ ISP: Specific route groups

---

## 🔧 SOLID Principles Implementation

### Single Responsibility Principle (SRP)
✅ **Applied in**:
- Each use case class does ONE thing
- Each entity represents ONE concept
- Each utility function has ONE purpose

**Example**:
```python
# ✅ Good - Single responsibility
class RegisterUserUseCase:  # Only registers users
class LoginUserUseCase:     # Only handles login
class UpdateUserProfileUseCase:  # Only updates profile
```

---

### Open/Closed Principle (OCP)
✅ **Applied in**:
- Entities can be extended via inheritance
- New use cases can be added without modifying existing ones

**Example**:
```python
# ✅ Open for extension
class BaseEntity:
    created_at: datetime
    updated_at: datetime

class User(BaseEntity):  # Extends base
class Product(BaseEntity):  # Extends base
```

---

### Liskov Substitution Principle (LSP)
✅ **Applied in**:
- All repository implementations can substitute their interfaces
- All entities follow consistent patterns

---

### Interface Segregation Principle (ISP)
✅ **Applied in**:
- Specific repository interfaces (not one big interface)

**Example**:
```python
# ✅ Good - Specific interfaces
class IUserRepository(ABC):  # Only user operations
class IProductRepository(ABC):  # Only product operations

# ❌ Bad - Would be one huge IRepository with all methods
```

---

### Dependency Inversion Principle (DIP)
✅ **Applied in**:
- Use cases depend on repository INTERFACES
- Infrastructure implements those interfaces

**Example**:
```python
# High-level (Use Case) depends on abstraction
class CreateProductUseCase:
    def __init__(self, repository: IProductRepository):  # Interface
        self.repository = repository

# Low-level (Infrastructure) implements abstraction
class PrismaProductRepository(IProductRepository):
    async def create(self, product: Product) -> Product:
        # Implementation details
```

---

## 🖼️ Image to Base64 Feature

### Backend Implementation
**File**: `backend/infrastructure/utils/image_utils.py`

**Functions**:
```python
def image_to_base64(image_bytes, format) -> str
    # Converts image bytes to base64 data URI

def base64_to_image(base64_string) -> (bytes, format)
    # Converts base64 back to image bytes

def compress_image(image_bytes, max_width, max_height, quality) -> bytes
    # Resize and compress using Pillow

def validate_image(image_bytes, max_size_mb) -> (bool, error)
    # Validate type, size, format

def process_upload_image(base64_string, compress, max_size_mb) -> (success, data, error)
    # Complete pipeline: validate → compress → convert
```

**Used in**:
- `CreateProductUseCase` - Process product images
- `UpdateProductUseCase` - Update product images
- `UpdateUserProfileUseCase` - Update user avatar
- `CreateBannerUseCase` - Process banner images

---

### Frontend Implementation
**File**: `frontend/lib/image.ts`

**Functions**:
```typescript
async function fileToBase64(file: File): Promise<string>
    // File/Blob → Base64

async function filesToBase64Array(files: File[]): Promise<string[]>
    // Multiple files → Base64 array

async function compressImage(file, maxWidth, maxHeight, quality): Promise<string>
    // Client-side compression before upload

async function prepareImageForUpload(file, options): Promise<Result>
    // Complete pipeline: validate → compress → convert
```

**Used in**:
- `/admin/products/create` - Product images (main + gallery)
- `/admin/banners/edit` - Banner images
- `/profile` - User avatar upload

---

## 🗄️ Database Schema (Prisma + NeonDB)

### Tables & Relationships

```
users
├── id (cuid)
├── email (unique)
├── password (hashed)
├── name
├── phone
├── avatar (TEXT - Base64) ← 🖼️
├── role (ADMIN/CUSTOMER)
├── address
└── orders (1-to-many)

categories
├── id (cuid)
├── name (unique)
├── slug (unique)
├── description
├── image (TEXT - Base64) ← 🖼️
└── products (1-to-many)

products
├── id (cuid)
├── name
├── slug (unique)
├── description
├── price (Decimal)
├── discount (Decimal)
├── stock (Int)
├── image (TEXT - Base64) ← 🖼️ Main image
├── images (TEXT[] - Base64[]) ← 🖼️ Gallery
├── featured (Boolean)
├── categoryId → categories
└── orderItems (1-to-many)

banners
├── id (cuid)
├── title
├── subtitle
├── image (TEXT - Base64) ← 🖼️
├── link
├── order (Int)
└── active (Boolean)

orders
├── id (cuid)
├── order_number (unique)
├── userId → users
├── status (ENUM)
├── total_amount (Decimal)
├── shipping_fee (Decimal)
├── discount_amount (Decimal)
├── final_amount (Decimal)
├── shipping_name/phone/address
└── orderItems (1-to-many)

order_items
├── id (cuid)
├── orderId → orders
├── productId → products
├── quantity (Int)
├── price (Decimal - snapshot)
├── discount (Decimal - snapshot)
└── subtotal (Decimal)
```

**Tất cả images đều lưu dưới dạng Base64 trong TEXT fields**

---

## 🎨 Frontend Architecture

### Next.js App Router Structure
```
app/
├── layout.tsx          # Root layout with fonts, metadata
├── page.tsx           # Homepage (/)
├── globals.css        # Tailwind imports
│
├── admin/             # Admin routes group
│   └── products/
│       ├── page.tsx       # List products
│       └── create/
│           └── page.tsx   # Create product with image upload
│
├── profile/
│   └── page.tsx       # User profile with avatar upload
│
└── (auth)/            # Auth routes group (TODO)
    ├── login/
    └── register/
```

### Key Frontend Features

**1. Image Upload to Base64**
```typescript
// In any component
const handleImageUpload = async (file: File) => {
  const result = await prepareImageForUpload(file, {
    compress: true,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85
  });
  
  if (result.success) {
    setImage(result.data);  // Base64 string ready for API
  }
}
```

**2. Prisma Client Usage**
```typescript
import { prisma } from '@/lib/prisma';

// Server component or API route
const products = await prisma.product.findMany({
  include: { category: true }
});
```

---

## 📊 Data Flow

### Create Product Flow (with Image Upload)

```
1. User selects image file in browser
   ↓
2. Frontend: prepareImageForUpload()
   - Validate file type & size
   - Compress image (Canvas API)
   - Convert to base64 data URI
   ↓
3. Frontend: Send to API
   POST /api/products {
     name, price, image: "data:image/jpeg;base64,..."
   }
   ↓
4. Backend: CreateProductUseCase
   - Receive DTO with base64 image
   - process_upload_image() - re-validate & optimize
   - Create Product entity
   ↓
5. Infrastructure: Repository
   - Save to NeonDB (image as TEXT)
   ↓
6. Response: Product created
   ↓
7. Frontend: Show success, display image from base64
```

---

## 🔐 Security Features

### Password Security
```python
# Hashing with bcrypt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
hashed = pwd_context.hash(plain_password)  # Register
is_valid = pwd_context.verify(plain, hashed)  # Login
```

### JWT Authentication
```python
# Create token
token = create_access_token({
    "sub": user.id,
    "email": user.email,
    "role": user.role
})

# Verify token
payload = verify_token(token)
```

### Image Upload Security
```python
# Validation
- File type: JPEG, PNG, GIF, WEBP only
- File size: 5MB limit
- Compression: Auto-resize to max dimensions
- Format check: Pillow verify()
```

---

## 🚀 Mock Data

### Seeded Data (prisma/seed.ts)

**Users**:
- 1 Admin: admin@homegoods.com
- 2 Customers: customer1@example.com, customer2@example.com
- Password: `password123` (hashed với bcrypt)
- Avatars: SVG placeholders as base64

**Categories** (4):
- Đồ Dùng Nhà Bếp
- Nội Thất
- Đồ Vệ Sinh
- Đồ Trang Trí
- Images: SVG placeholders as base64

**Products** (9):
- Bộ Nồi Inox, Chảo, Bình Nước (Kitchen)
- Bàn Làm Việc, Ghế Xoay (Furniture)
- Máy Hút Bụi, Cây Lau Nhà (Cleaning)
- Tranh Canvas, Chậu Cây (Decor)
- Images: SVG placeholders as base64
- Gallery images: Multiple base64 strings

**Banners** (3):
- Seasonal sale banners
- Images: SVG placeholders as base64

**Orders** (2):
- Sample orders with items
- Different statuses (DELIVERED, PROCESSING)

---

## 🎓 Learning Points

### Why Clean Architecture?
1. **Testable**: Each layer can be tested independently
2. **Maintainable**: Changes in UI don't affect business logic
3. **Flexible**: Easy to swap database/framework
4. **Scalable**: Clear separation of concerns

### Why SOLID?
1. **SRP**: Easy to find and fix bugs
2. **OCP**: Add features without breaking existing code
3. **LSP**: Reliable polymorphism
4. **ISP**: Don't force unnecessary dependencies
5. **DIP**: Depend on abstractions, not concretions

### Why Base64 for Images?
**Pros**:
- ✅ Simple to implement
- ✅ No separate file storage needed
- ✅ Easy to backup with database
- ✅ No CDN/S3 configuration needed

**Cons**:
- ❌ 33% larger than binary
- ❌ Not ideal for very large images
- ❌ More database storage

**Best for**:
- Small-medium images (avatars, product photos)
- Prototypes and MVPs
- When simplicity > performance

---

## 📝 TODO - Để Hoàn Thiện Project

### Backend
- [ ] Implement Prisma repository classes
- [ ] Create API routes (auth, products, categories, etc.)
- [ ] Add authentication middleware
- [ ] Error handling & logging
- [ ] Unit tests for use cases
- [ ] API documentation

### Frontend
- [ ] Integrate with backend API
- [ ] Authentication context & protected routes
- [ ] Product listing & detail pages
- [ ] Shopping cart state management
- [ ] Checkout flow
- [ ] Admin dashboard layout
- [ ] Loading states & error handling

### DevOps
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production environment config
- [ ] Monitoring & logging

---

## 📞 Contact & Support

Project created following:
- Clean Architecture principles
- SOLID design patterns
- Industry best practices

For questions about architecture decisions, refer to this document.

---

**🎉 Architecture Documentation Complete!**
