import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏠 Home Goods Store</h1>
          <div className="space-x-4">
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Sản phẩm
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              Đăng nhập
            </Link>
            <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Chào mừng đến với Home Goods Store
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Đồ gia dụng chất lượng cao với giá tốt nhất
        </p>
        <div className="space-x-4">
          <Link 
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Xem sản phẩm
          </Link>
          <Link 
            href="/categories"
            className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Danh mục
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Miễn phí vận chuyển</h3>
            <p className="text-gray-600">Cho đơn hàng trên 500.000đ</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="text-xl font-semibold mb-2">Chất lượng đảm bảo</h3>
            <p className="text-gray-600">Sản phẩm chính hãng 100%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
            <p className="text-gray-600">Bảo mật thông tin tuyệt đối</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Home Goods Store. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Built with Clean Architecture & SOLID Principles</p>
        </div>
      </footer>
    </div>
  )
}
