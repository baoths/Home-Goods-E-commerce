'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { productsApi, authApi, type Product } from '@/lib/api'

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Check if user is logged in
  useEffect(() => {
    const userData = authApi.getStoredUser()
    if (userData) {
      setUser(userData)
    }
  }, [])

  // Load products from API
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
      } catch (err: any) {
        console.error('Error loading products:', err)
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Chỉ hiện modal nếu chưa đăng nhập
      if (user) return
      
      // Hiện modal đăng ký/đăng nhập khi scroll tới sản phẩm thứ 10
      const productCards = document.querySelectorAll('.product-card')
      if (productCards.length >= 10) {
        const tenthProduct = productCards[9]
        const rect = tenthProduct.getBoundingClientRect()
        if (rect.top < window.innerHeight) {
          setShowAuthModal(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [user])

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-black text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <div>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</div>
          <div className="flex gap-4">
            <Link href="/help" className="hover:text-gray-300">Trợ giúp</Link>
            <Link href="/track" className="hover:text-gray-300">Theo dõi đơn hàng</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-black">
              HomeGoods
            </Link>

            {/* Search Bar */}
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

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/cart" className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <span className="text-sm font-medium text-black">Giỏ hàng</span>
                  </Link>
                  <div className="relative group">
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                      {/* Avatar or Initials */}
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border-2 border-black"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-black">{user.name}</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                        Thông tin tài khoản
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                        Đơn hàng của tôi
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                          Quản trị
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          authApi.logout()
                          setUser(null)
                          window.location.reload()
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100 font-medium text-black">
                    Đăng Nhập
                  </Link>
                  <Link href="/register" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium">
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Category Menu - Always Visible */}
          <nav className="mt-4 flex gap-8 text-sm font-medium border-t pt-4">
            <Link href="/category/kitchen" className="text-black hover:text-gray-600">
              Nhà Bếp
            </Link>
            <Link href="/category/furniture" className="text-black hover:text-gray-600">
              Nội Thất
            </Link>
            <Link href="/category/cleaning" className="text-black hover:text-gray-600">
              Vệ Sinh
            </Link>
            <Link href="/category/decor" className="text-black hover:text-gray-600">
              Trang Trí
            </Link>
            <Link href="/deals" className="text-red-600 font-bold">
              🔥 Giảm Giá
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">Bộ sưu tập mới</span>
              <h1 className="text-6xl font-bold text-black mt-2 mb-4">
                Làm Mới<br />Không Gian Sống
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Đồ gia dụng cao cấp với giá tốt nhất. Giảm đến 50% cho khách hàng mới.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="#products"
                  className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Mua Ngay
                </Link>
                <Link 
                  href="/categories"
                  className="border-2 border-black text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Xem Danh Mục
                </Link>
              </div>
            </div>
            <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
              <div className="text-6xl">🏠</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Tất Cả Sản Phẩm</h2>
          <select className="px-4 py-2 border rounded-lg text-black">
            <option>Mới nhất</option>
            <option>Giá thấp đến cao</option>
            <option>Giá cao đến thấp</option>
            <option>Bán chạy</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="product-card group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition">
              <Link href={`/product/${product.id}`}>
                <div className="bg-gray-100 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-gray-400">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-black">{product.name}</h3>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-lg text-black">{Number(product.price).toLocaleString()}đ</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">{Number(product.originalPrice).toLocaleString()}đ</span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              </Link>
              <div className="px-4 pb-4">
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
                  }}
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Đăng nhập để xem thêm</h2>
            <p className="text-gray-600 mb-6">
              Đăng nhập hoặc đăng ký để khám phá thêm nhiều sản phẩm và nhận ưu đãi độc quyền!
            </p>
            <div className="space-y-3">
              <Link 
                href="/login"
                className="block w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800"
              >
                Đăng Nhập
              </Link>
              <Link 
                href="/register"
                className="block w-full border-2 border-black text-black py-3 rounded-lg text-center font-semibold hover:bg-gray-100"
              >
                Đăng Ký
              </Link>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="block w-full text-gray-600 py-3 text-center hover:text-black"
              >
                Tiếp tục xem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚚</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Miễn Phí Vận Chuyển</h3>
                <p className="text-gray-600 text-sm">Cho đơn hàng trên 500.000đ</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">💯</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Chính Hãng 100%</h3>
                <p className="text-gray-600 text-sm">Cam kết sản phẩm chất lượng</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔄</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Đổi Trả 30 Ngày</h3>
                <p className="text-gray-600 text-sm">Miễn phí đổi trả trong 30 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t">
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
