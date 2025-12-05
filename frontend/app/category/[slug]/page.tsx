'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const categoryMap: { [key: string]: { name: string; icon: string } } = {
    'kitchen': { name: 'Nhà Bếp', icon: '🍳' },
    'furniture': { name: 'Nội Thất', icon: '🪑' },
    'cleaning': { name: 'Vệ Sinh', icon: '🧹' },
    'decor': { name: 'Trang Trí', icon: '🎨' }
  }

  const category = categoryMap[params.slug as string] || { name: 'Tất cả', icon: '🛍️' }

  // Mock products - sẽ thay bằng data từ API
  const products = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `${category.name} ${i + 1}`,
    description: 'Mô tả ngắn gọn về sản phẩm chất lượng cao',
    price: (Math.random() * 2000000 + 100000).toFixed(0),
    originalPrice: (Math.random() * 3000000 + 100000).toFixed(0),
    discount: Math.floor(Math.random() * 50),
    image: category.icon,
    rating: (Math.random() * 2 + 3).toFixed(1),
    sold: Math.floor(Math.random() * 1000)
  }))

  const handleAddToCart = (productId: number) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
      router.push('/login')
      return
    }
    alert(`Đã thêm sản phẩm vào giỏ hàng`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <div>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</div>
          <div className="flex gap-4">
            <Link href="/help" className="hover:text-gray-300">Trợ giúp</Link>
            <Link href="/track" className="hover:text-gray-300">Theo dõi đơn hàng</Link>
          </div>
        </div>
      </div>

      <header className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-black">
              🏠 HomeGoods
            </Link>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <button className="absolute right-0 top-0 bottom-0 px-6 bg-black text-white rounded-r-lg hover:bg-gray-800">
                  Tìm
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/account" className="px-4 py-2 hover:bg-gray-100 rounded-lg">
                    Xin chào, {user.name}
                  </Link>
                  <Link href="/cart" className="px-4 py-2 hover:bg-gray-100 rounded-lg relative">
                    🛒 Giỏ hàng
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100 font-medium">
                    Đăng Nhập
                  </Link>
                  <Link href="/register" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium">
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>
          </div>

          <nav className="mt-4 flex gap-8 text-sm font-medium border-t pt-4">
            <Link href="/category/kitchen" className={`text-black hover:text-gray-600 ${params.slug === 'kitchen' ? 'font-bold border-b-2 border-black pb-1' : ''}`}>
              Nhà Bếp
            </Link>
            <Link href="/category/furniture" className={`text-black hover:text-gray-600 ${params.slug === 'furniture' ? 'font-bold border-b-2 border-black pb-1' : ''}`}>
              Nội Thất
            </Link>
            <Link href="/category/cleaning" className={`text-black hover:text-gray-600 ${params.slug === 'cleaning' ? 'font-bold border-b-2 border-black pb-1' : ''}`}>
              Vệ Sinh
            </Link>
            <Link href="/category/decor" className={`text-black hover:text-gray-600 ${params.slug === 'decor' ? 'font-bold border-b-2 border-black pb-1' : ''}`}>
              Trang Trí
            </Link>
            <Link href="/deals" className="text-red-600 font-bold">
              🔥 Giảm Giá
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span>/</span>
            <span className="text-black">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Banner */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-gray-600">Khám phá {products.length} sản phẩm chất lượng cao</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-lg text-black">Khoảng giá</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'all'}
                      onChange={() => setPriceRange('all')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-black">Tất cả</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'under500k'}
                      onChange={() => setPriceRange('under500k')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-black">Dưới 500.000đ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === '500k-1m'}
                      onChange={() => setPriceRange('500k-1m')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-black">500.000đ - 1.000.000đ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'over1m'}
                      onChange={() => setPriceRange('over1m')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-black">Trên 1.000.000đ</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-lg text-black">Đánh giá</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map(stars => (
                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm flex items-center gap-1">
                        {'⭐'.repeat(stars)}
                        {stars < 5 && <span className="text-gray-400">{'☆'.repeat(5 - stars)}</span>}
                        <span className="text-gray-600 ml-1">trở lên</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-lg text-black">Giảm giá</h3>
                <div className="space-y-2">
                  {['10%', '20%', '30%', '50%'].map(discount => (
                    <label key={discount} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-black">Giảm từ {discount}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button className="w-full border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-black">
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Hiển thị <span className="font-bold text-black">{products.length}</span> sản phẩm</p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg cursor-pointer text-black"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="best-selling">Bán chạy</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="product-card group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <Link href={`/product/${product.id}`}>
                    <div className="bg-gray-100 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition relative">
                      <span className="text-5xl">{product.image}</span>
                      {product.discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-black">{product.name}</h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-1 mb-2 text-xs">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">Đã bán {product.sold}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg text-black">{parseInt(product.price).toLocaleString()}đ</span>
                        <span className="text-gray-400 line-through text-sm">{parseInt(product.originalPrice).toLocaleString()}đ</span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                ← Trước
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg">1</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">2</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">3</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">4</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Sau →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">🏠 HomeGoods</h3>
              <p className="text-gray-600 text-sm">
                Đồ gia dụng chất lượng cao với giá tốt nhất thị trường.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Mua Sắm</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/products" className="hover:text-black">Sản phẩm</Link></li>
                <li><Link href="/deals" className="hover:text-black">Khuyến mãi</Link></li>
                <li><Link href="/new" className="hover:text-black">Hàng mới</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/contact" className="hover:text-black">Liên hệ</Link></li>
                <li><Link href="/shipping" className="hover:text-black">Vận chuyển</Link></li>
                <li><Link href="/returns" className="hover:text-black">Đổi trả</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Theo Dõi</h4>
              <div className="flex gap-4">
                <a href="#" className="text-2xl hover:text-gray-600">📘</a>
                <a href="#" className="text-2xl hover:text-gray-600">📷</a>
                <a href="#" className="text-2xl hover:text-gray-600">🐦</a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 HomeGoods. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
