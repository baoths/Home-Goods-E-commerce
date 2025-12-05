'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { productsApi, authApi, type Product } from '@/lib/api'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Load product from API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await productsApi.getProduct(params.id as string)
        setProduct(productData)
        setError(null)
        
        // Load related products from same category
        const relatedResponse = await productsApi.getProducts({
          category: productData.categorySlug,
          pageSize: 5
        })
        // Filter out current product
        const filtered = relatedResponse.products.filter(p => p.id !== productData.id).slice(0, 5)
        setRelatedProducts(filtered)
      } catch (err: any) {
        console.error('Error loading product:', err)
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  useEffect(() => {
    // Kiểm tra user đã đăng nhập chưa
    const userData = authApi.getStoredUser()
    if (userData) {
      setUser(userData)
    }
  }, [])

  // Loading state
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

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-red-600 mb-4">
            {error || 'Không tìm thấy sản phẩm'}
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
      router.push('/login')
      return
    }
    
    // Thêm vào giỏ hàng
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để mua hàng')
      router.push('/login')
      return
    }
    
    // Chuyển đến trang checkout
    router.push('/checkout')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Giống trang chủ */}
      <div className="bg-black text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <div>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</div>
          <div className="flex gap-4">
            <Link href="/help" className="hover:text-gray-300">Trợ giúp</Link>
            <Link href="/track" className="hover:text-gray-300">Theo dõi đơn hàng</Link>
          </div>
        </div>
      </div>

      <header className="border-b">
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
                      {user.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                          Quản trị
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          authApi.logout()
                          setUser(null)
                          router.push('/')
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

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span>/</span>
            <Link href={`/category/${product.categorySlug}`} className="hover:text-black">{product.categoryName}</Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center mb-4">
              <span className="text-9xl">{product.image || '🛍️'}</span>
            </div>
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`bg-gray-100 aspect-square rounded-lg flex items-center justify-center text-4xl hover:border-2 hover:border-black transition ${
                      selectedImage === idx ? 'border-2 border-black' : ''
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-black">HomeGoods</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-black">SKU: {product.id}</span>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-black">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="text-sm text-black">(4.5)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-black">234 đánh giá</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-black">Đã bán: 1.2k</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-black">
                  {Number(product.price).toLocaleString()}đ
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {Number(product.originalPrice).toLocaleString()}đ
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-black">Tiết kiệm: {(Number(product.originalPrice) - Number(product.price)).toLocaleString()}đ</p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-black leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-black text-sm">Danh mục:</span>
                  <Link href={`/category/${product.categorySlug}`} className="ml-2 text-black font-medium hover:underline">
                    {product.categoryName}
                  </Link>
                </div>
                <div>
                  <span className="text-black text-sm">Tình trạng:</span>
                  <span className={`ml-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-black font-medium">Số lượng:</span>
                <div className="flex items-center border-2 border-black rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 font-bold text-black"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x-2 border-black py-2 text-black"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 font-bold text-black"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-black">{product.stock} sản phẩm có sẵn</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-black text-black py-4 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  🛒 Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition"
                >
                  Mua ngay
                </button>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-2">Chức năng quản trị:</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      ✏️ Chỉnh sửa
                    </Link>
                    <button
                      onClick={() => confirm('Bạn có chắc muốn xóa sản phẩm này?')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Policies */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-3xl mb-2">🚚</div>
                <p className="text-sm font-medium text-black">Miễn phí vận chuyển</p>
                <p className="text-xs text-black">Cho đơn từ 500k</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <p className="text-sm font-medium text-black">Đổi trả 30 ngày</p>
                <p className="text-xs text-black">Miễn phí đổi trả</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💯</div>
                <p className="text-sm font-medium text-black">Chính hãng 100%</p>
                <p className="text-xs text-black">Bảo hành 12 tháng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Tabs */}
        <div className="mt-16">
          <div className="border-b mb-8">
            <div className="flex gap-8">
              <button className="pb-4 border-b-2 border-black font-bold text-black">Mô tả chi tiết</button>
              <button className="pb-4 text-black hover:text-gray-600">Đánh giá (234)</button>
              <button className="pb-4 text-black hover:text-gray-600">Chính sách</button>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="text-black leading-relaxed whitespace-pre-line">
              {product.description}
              
              <h3 className="text-xl font-bold mt-6 mb-3 text-black">Đặc điểm nổi bật:</h3>
              <ul className="list-disc ml-6 space-y-2 text-black">
                <li>Chất liệu cao cấp, bền đẹp</li>
                <li>Thiết kế hiện đại, sang trọng</li>
                <li>Dễ dàng vệ sinh và bảo quản</li>
                <li>Bảo hành 12 tháng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-black">Sản phẩm liên quan</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <Link href={`/product/${relatedProduct.id}`}>
                    <div className="bg-gray-100 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition">
                      <span className="text-5xl">{relatedProduct.image || '🛍️'}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-black">{relatedProduct.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg text-black">{Number(relatedProduct.price).toLocaleString()}đ</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">{Number(relatedProduct.originalPrice).toLocaleString()}đ</span>
                        )}
                      </div>
                      {relatedProduct.discount > 0 && (
                        <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                          -{relatedProduct.discount}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        if (!user) {
                          alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
                          router.push('/login')
                        } else {
                          alert(`Đã thêm "${relatedProduct.name}" vào giỏ hàng`)
                        }
                      }}
                      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-black py-8">Không có sản phẩm liên quan</p>
          )}
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
