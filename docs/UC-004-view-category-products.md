# Use Case: View Kitchen Category (Xem Danh Mục Nhà Bếp)

## Mô tả
Người dùng click vào "Nhà Bếp" trên navigation bar để xem tất cả sản phẩm thuộc danh mục nhà bếp.

## Actors
- Visitor (Khách vãng lai)
- Customer (Khách hàng đã đăng nhập)
- Admin (Quản trị viên)

## Preconditions
- Trang web đã load xong
- Category "Nhà Bếp" tồn tại trong database với slug = "kitchen"

## Trigger
User click vào link "Nhà Bếp" trong navigation bar

## Main Flow

### 1. User Click Navigation Link
```
Action: Click "Nhà Bếp" 
Element: <Link href="/category/kitchen">
Current URL: http://localhost:3000
Target URL: http://localhost:3000/category/kitchen
```

### 2. Next.js Route Navigation
```typescript
File: frontend/app/category/[slug]/page.tsx

Router:
- Next.js App Router intercepts click
- Client-side navigation (không reload page)
- params.slug = "kitchen"
- Component CategoryPage được mount
```

### 3. Initialize Component State
```typescript
const CategoryPage = () => {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // params.slug = "kitchen"
}
```

### 4. Check User Authentication
```typescript
useEffect(() => {
  const userData = authApi.getStoredUser()
  if (userData) {
    setUser(userData)
  }
}, [])
```

### 5. Load Category Data and Products
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Step 5.1: Load category info
      const categoriesResponse = await categoriesApi.getCategories()
      console.log('All categories:', categoriesResponse.categories)
      
      const foundCategory = categoriesResponse.categories.find(
        c => c.slug === params.slug  // "kitchen"
      )
      console.log('Found category:', foundCategory)
      setCategory(foundCategory)
      
      // Step 5.2: Load products for this category
      const response = await productsApi.getProducts({
        category: params.slug,  // "kitchen"
        sortBy: sortBy,
        pageSize: 50
      })
      console.log('Products for category:', response.products)
      setProducts(response.products)
      
      setError(null)
    } catch (err) {
      console.error('Error loading category data:', err)
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }
  
  if (params.slug) {
    loadData()
  }
}, [params.slug, sortBy])
```

### 6. API Call Flow

#### 6.1 Get Categories API
```
GET /api/categories

Backend Flow:
1. File: frontend/app/api/categories/route.ts
2. Query Prisma: SELECT * FROM Category
3. Return all categories with id, name, slug, description, image

Response:
{
  categories: [
    {
      id: "cat-1",
      name: "Nhà Bếp",
      slug: "kitchen",
      description: "Đồ dùng nhà bếp chất lượng",
      image: "data:image/png;base64,...",
      createdAt: "2024-01-01"
    },
    ...
  ]
}
```

#### 6.2 Get Products by Category API
```
GET /api/products?category=kitchen&sortBy=newest&pageSize=50

Backend Flow:
1. File: frontend/app/api/products/route.ts
2. Parse query params:
   - category = "kitchen"
   - sortBy = "newest"
   - pageSize = 50

3. Find category by slug:
   const categoryObj = await prisma.category.findUnique({
     where: { slug: "kitchen" }
   })
   // categoryObj.id = "cat-1"

4. Query products:
   const products = await prisma.product.findMany({
     where: { categoryId: "cat-1" },
     include: { category: true },
     orderBy: { createdAt: 'desc' },
     take: 50
   })

5. Return products array
```

**Database Query:**
```sql
-- Step 1: Find category
SELECT id, name, slug 
FROM Category 
WHERE slug = 'kitchen'
LIMIT 1;

-- Step 2: Get products
SELECT 
  p.*,
  c.name as categoryName,
  c.slug as categorySlug
FROM Product p
INNER JOIN Category c ON p.categoryId = c.id
WHERE p.categoryId = 'cat-1'
ORDER BY p.createdAt DESC
LIMIT 50;
```

### 7. Render Category Page

#### 7.1 During Loading
```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <div className="text-xl font-semibold">Đang tải sản phẩm...</div>
      </div>
    </div>
  )
}
```

#### 7.2 On Error
```tsx
if (error) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <div className="text-xl font-semibold text-red-600 mb-4">{error}</div>
        <button onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    </div>
  )
}
```

#### 7.3 Successful Load - Page Structure

**Header:**
- Same as homepage
- User avatar/login buttons
- Search bar
- Navigation bar (Nhà Bếp được highlight)

**Breadcrumb:**
```
Trang chủ / Nhà Bếp
```

**Category Banner:**
```tsx
<div className="bg-gradient-to-r from-gray-100 to-gray-200">
  <div className="container mx-auto px-4 py-12">
    <div className="flex items-center gap-4">
      {category?.image ? (
        <img 
          src={category.image}  // Base64 image
          alt={category.name}
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <span className="text-6xl">🛍️</span>
      )}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          {category?.name || 'Danh mục'}
        </h1>
        <p className="text-gray-600">
          Khám phá {products.length} sản phẩm chất lượng cao
        </p>
      </div>
    </div>
  </div>
</div>
```

**Main Content Area:**

**Left Sidebar - Filters:**
```tsx
<div className="w-64 flex-shrink-0">
  {/* Price Range Filter */}
  <div className="mb-8">
    <h3 className="font-bold mb-4">Khoảng giá</h3>
    <label>
      <input type="radio" name="price" value="all" />
      Tất cả
    </label>
    <label>
      <input type="radio" name="price" value="under500k" />
      Dưới 500.000đ
    </label>
    <label>
      <input type="radio" name="price" value="500k-1m" />
      500.000đ - 1.000.000đ
    </label>
    <label>
      <input type="radio" name="price" value="over1m" />
      Trên 1.000.000đ
    </label>
  </div>
  
  {/* Rating Filter */}
  <div className="mb-8">
    <h3 className="font-bold mb-4">Đánh giá</h3>
    {/* Star ratings checkboxes */}
  </div>
  
  {/* Discount Filter */}
  <div className="mb-8">
    <h3 className="font-bold mb-4">Giảm giá</h3>
    {/* Discount percentage options */}
  </div>
  
  <button>Xóa tất cả bộ lọc</button>
</div>
```

**Right Content - Products Grid:**
```tsx
<div className="flex-1">
  {/* Sort Bar */}
  <div className="flex justify-between items-center mb-6">
    <p>Hiển thị <strong>{products.length}</strong> sản phẩm</p>
    <select 
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="newest">Mới nhất</option>
      <option value="price-asc">Giá thấp đến cao</option>
      <option value="price-desc">Giá cao đến thấp</option>
      <option value="best-selling">Bán chạy</option>
      <option value="rating">Đánh giá cao</option>
    </select>
  </div>
  
  {/* Products Grid */}
  {products.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3>Không tìm thấy sản phẩm</h3>
      <p>Danh mục này hiện chưa có sản phẩm nào.</p>
    </div>
  )}
  
  {/* Pagination */}
  {products.length > 0 && (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Pagination buttons */}
    </div>
  )}
</div>
```

**Product Card Component:**
```tsx
<div className="border rounded-lg overflow-hidden hover:shadow-lg">
  <Link href={`/product/${product.id}`}>
    <div className="bg-gray-100 aspect-square">
      {product.image ? (
        <img 
          src={product.image}  // Base64 decoded
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-5xl">📦</span>
      )}
      {product.discount > 0 && (
        <span className="absolute top-2 right-2 bg-red-600 text-white">
          -{product.discount}%
        </span>
      )}
    </div>
    <div className="p-4">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="flex items-center gap-2">
        <span className="font-bold">
          {Number(product.price).toLocaleString()}đ
        </span>
        {product.originalPrice && (
          <span className="text-gray-400 line-through">
            {Number(product.originalPrice).toLocaleString()}đ
          </span>
        )}
      </div>
    </div>
  </Link>
  <div className="px-4 pb-4">
    <button onClick={() => handleAddToCart(product.id)}>
      Thêm vào giỏ
    </button>
  </div>
</div>
```

### 8. User Interactions

#### 8.1 Change Sort Order
```
User: Select "Giá thấp đến cao" from dropdown
Action: setSortBy('price-asc')
Effect: useEffect re-runs with new sortBy
API: GET /api/products?category=kitchen&sortBy=price-asc&pageSize=50
Result: Products re-render in ascending price order
```

#### 8.2 Click Product
```
User: Click on a product card
Action: Navigate to /product/{productId}
Component: ProductDetailPage loaded
Use Case: [UC-003: View Product Detail]
```

#### 8.3 Add to Cart
```
User: Click "Thêm vào giỏ" button
Check: User is logged in?
  - Yes: Add to cart (future implementation)
  - No: Alert "Vui lòng đăng nhập" → redirect to /login
```

## Postconditions

### Successful Load
- ✅ Category page hiển thị với đúng category
- ✅ Products filtered by categoryId
- ✅ Breadcrumb hiển thị đúng
- ✅ Filters và sort controls hoạt động
- ✅ URL = /category/kitchen

### Failed Load
- ❌ Error message displayed
- ❌ "Thử lại" button available
- ❌ Products = []

## Alternative Flows

### A1: Category Not Found
```
1. API returns categories but slug "kitchen" không match
2. foundCategory = null
3. setCategory(null)
4. Display: "Danh mục" (generic title)
5. Products may still load if category exists in DB
```

### A2: No Products in Category
```
1. API returns empty products array
2. products.length === 0
3. Display: "🔍 Không tìm thấy sản phẩm"
4. Message: "Danh mục này hiện chưa có sản phẩm nào"
```

### A3: Invalid Category Slug
```
1. User navigates to /category/invalid-slug
2. Category not found in database
3. API returns all products (no filter)
4. Display generic category page
```

## Technical Details

### URL Structure
```
Pattern: /category/[slug]
Examples:
- /category/kitchen
- /category/furniture
- /category/cleaning
- /category/decor
```

### State Management
```typescript
States:
- user: User | null
- sortBy: string ('newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating')
- priceRange: string ('all' | 'under500k' | '500k-1m' | 'over1m')
- products: Product[]
- category: Category | null
- loading: boolean
- error: string | null
```

### Performance Optimizations
1. **Client-side navigation**: No full page reload
2. **Lazy load images**: Load khi scroll
3. **Debounce filters**: Không call API liên tục khi user thay đổi filter
4. **Cache category data**: Categories ít thay đổi, có thể cache

### Console Logs for Debugging
```typescript
console.log('All categories:', categoriesResponse.categories)
console.log('Looking for slug:', params.slug)
console.log('Found category:', foundCategory)
console.log('Products for category:', response.products)
```

## Related Use Cases
- [UC-001: Open Website](./UC-001-open-website.md)
- [UC-003: View Product Detail](./UC-003-view-product-detail.md)
- [UC-005: Add to Cart](./UC-005-add-to-cart.md)
- [UC-010: Filter Products](./UC-010-filter-products.md)

## Notes
- Category slug phải match với database
- Products được filter bằng categoryId (không phải slug)
- API tự động convert slug → categoryId
- Filters hiện tại chỉ là UI, chưa hoạt động (TODO)
