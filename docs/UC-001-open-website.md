# Use Case: Open Website (Mở Website)

## Mô tả
Người dùng truy cập trang chủ website lần đầu tiên hoặc refresh trang.

## Actors
- Visitor (Khách vãng lai - chưa đăng nhập)
- Customer (Khách hàng - đã đăng nhập)
- Admin (Quản trị viên)

## Preconditions
- Website đang hoạt động
- Trình duyệt có kết nối internet

## Main Flow

### 1. User mở URL
```
Action: Người dùng nhập URL hoặc click vào bookmark
URL: http://localhost:3000 hoặc domain production
```

### 2. Next.js Server-Side Rendering
```typescript
File: frontend/app/page.tsx

Component: HomePage
- Component được mount
- Khởi tạo states:
  * showAuthModal: false
  * products: []
  * loading: true
  * error: null
  * user: null
```

### 3. Check Authentication Status
```typescript
useEffect(() => {
  const userData = authApi.getStoredUser()
  if (userData) {
    setUser(userData)
  }
}, [])

Logic:
- Đọc localStorage key "user"
- Parse JSON để lấy thông tin user
- Set vào state nếu tồn tại
```

**Kết quả:**
- Nếu có token → User đã đăng nhập → Hiển thị tên + avatar
- Nếu không → User chưa đăng nhập → Hiển thị nút Login/Register

### 4. Load Products from API
```typescript
useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productsApi.getProducts({ 
        pageSize: 20,
        sortBy: 'newest'
      })
      setProducts(response.products)
      setError(null)
    } catch (err) {
      setError('Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }
  loadProducts()
}, [])
```

**API Call:**
```
GET /api/products?pageSize=20&sortBy=newest

Backend Flow:
1. File: frontend/app/api/products/route.ts
2. Parse query params (pageSize, sortBy)
3. Prisma query:
   - Select products from database
   - Include category information
   - Order by createdAt DESC
   - Limit 20 records
4. Return JSON response với products array
```

**Database Query:**
```sql
SELECT 
  p.*,
  c.name as categoryName,
  c.slug as categorySlug
FROM Product p
LEFT JOIN Category c ON p.categoryId = c.id
ORDER BY p.createdAt DESC
LIMIT 20
```

### 5. Render UI Components

#### 5.1 Header
- Logo "HomeGoods"
- Search bar (inactive cho visitor)
- User section:
  * Nếu đã login: Avatar + Dropdown menu
  * Nếu chưa: "Đăng Nhập" + "Đăng Ký"

#### 5.2 Navigation Bar
```
[Nhà Bếp] [Nội Thất] [Vệ Sinh] [Trang Trí] [🔥 Giảm Giá]
```

#### 5.3 Hero Banner
- Large promotional banner
- CTA button "Mua Ngay"

#### 5.4 Featured Products Section
```
"Sản Phẩm Nổi Bật"
- Lọc products có featured = true
- Hiển thị grid 5 cột
- Mỗi card hiển thị:
  * Hình ảnh (Base64 decoded)
  * Tên sản phẩm
  * Giá
  * Discount badge (nếu có)
  * Nút "Thêm vào giỏ"
```

#### 5.5 All Products Section
```
"Tất Cả Sản Phẩm"
- Dropdown sắp xếp (Mới nhất, Giá, etc)
- Grid 5 cột với tất cả sản phẩm
- Pagination controls
```

#### 5.6 Footer
- Company info
- Quick links
- Social media links

### 6. Setup Scroll Event Listener
```typescript
useEffect(() => {
  const handleScroll = () => {
    if (user) return // Chỉ cho visitor
    
    const productCards = document.querySelectorAll('.product-card')
    if (productCards.length >= 10) {
      const tenthProduct = productCards[9]
      const rect = tenthProduct.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        setShowAuthModal(true) // Hiển thị popup đăng nhập
      }
    }
  }
  
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [user])
```

**Logic:**
- Visitor scroll đến sản phẩm thứ 10
- Hiển thị modal khuyến khích đăng nhập
- Chỉ hiển thị 1 lần

## Postconditions

### Successful Load
- ✅ Trang chủ hiển thị đầy đủ
- ✅ Header hiển thị đúng trạng thái user
- ✅ Products được load và render
- ✅ Scroll listener đã được setup
- ✅ Images được decode từ Base64

### Failed Load
- ❌ Hiển thị error message
- ❌ Nút "Thử lại" để reload
- ❌ Products = []

## Alternative Flows

### A1: Slow Network
```
1. Loading spinner hiển thị
2. "Đang tải sản phẩm..." message
3. User đợi
4. Timeout sau 30s → Show error
```

### A2: API Error
```
1. Catch error trong try-catch
2. Set error state
3. Hiển thị: "⚠️ Không thể tải sản phẩm"
4. Button "Thử lại" → window.location.reload()
```

### A3: Empty Products
```
1. response.products.length === 0
2. Hiển thị: "Chưa có sản phẩm nào"
3. Admin có thể thêm sản phẩm mới
```

## Technical Details

### Performance Optimizations
1. **Image Lazy Loading**: Images load khi scroll vào viewport
2. **Code Splitting**: Next.js tự động split code
3. **Static Generation**: Hero banner có thể cache
4. **Database Indexing**: Index trên `createdAt` cho sort nhanh

### State Management
```typescript
States:
- showAuthModal: boolean
- products: Product[]
- loading: boolean
- error: string | null
- user: User | null
```

### API Response Format
```typescript
{
  products: [
    {
      id: string,
      name: string,
      slug: string,
      description: string,
      price: number,
      originalPrice: number,
      discount: number,
      stock: number,
      image: string (Base64),
      images: string[],
      featured: boolean,
      categoryId: string,
      categoryName: string,
      categorySlug: string,
      createdAt: Date
    }
  ],
  pagination: {
    page: 1,
    pageSize: 20,
    total: number,
    totalPages: number
  }
}
```

## Related Use Cases
- [UC-002: User Login](./UC-002-user-login.md)
- [UC-003: View Product Detail](./UC-003-view-product-detail.md)
- [UC-004: View Category Products](./UC-004-view-category-products.md)
- [UC-005: Add to Cart](./UC-005-add-to-cart.md)

## Notes
- Trang chủ là entry point chính của website
- Performance rất quan trọng (First Contentful Paint < 2s)
- SEO optimization với meta tags
- Responsive design cho mobile/tablet
