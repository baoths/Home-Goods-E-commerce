'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, adminApi } from '@/lib/api'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0
  })

  useEffect(() => {
    const userData = authApi.getStoredUser()
    if (!userData) {
      router.push('/login')
      return
    }
    if (userData.role !== 'ADMIN') {
      router.push('/')
      return
    }
    setUser(userData)
    loadStatistics()
  }, [router])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getStatistics()
      setStatistics(response.statistics)
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-semibold text-black">Đang tải...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-black text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <div>🔒 Trang quản trị Admin</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-300">← Về trang chủ</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="text-2xl font-bold text-black">
              👨‍💼 Admin Dashboard
            </Link>

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
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
                  <Link href="/" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                    Về trang chủ
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      authApi.logout()
                      router.push('/')
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Bảng Điều Khiển Quản Trị</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="text-sm text-gray-600 mb-1">Tổng Sản Phẩm</div>
            <div className="text-3xl font-bold text-black">
              {loading ? '...' : statistics.totalProducts.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="text-sm text-gray-600 mb-1">Danh Mục</div>
            <div className="text-3xl font-bold text-black">
              {loading ? '...' : statistics.totalCategories.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <div className="text-sm text-gray-600 mb-1">Người Dùng</div>
            <div className="text-3xl font-bold text-black">
              {loading ? '...' : statistics.totalUsers.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <div className="text-sm text-gray-600 mb-1">Đơn Hàng</div>
            <div className="text-3xl font-bold text-black">
              {loading ? '...' : statistics.totalOrders.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products Management */}
          <Link 
            href="/admin/products"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200 hover:border-black"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                📦
              </div>
              <h2 className="text-xl font-bold text-black">Quản Lý Sản Phẩm</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Thêm, sửa, xóa sản phẩm. Quản lý giá, hình ảnh và mô tả sản phẩm.
            </p>
            <div className="mt-4 text-black font-medium">
              Xem chi tiết →
            </div>
          </Link>

          {/* Categories Management */}
          <Link 
            href="/admin/categories"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200 hover:border-black"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                🏷️
              </div>
              <h2 className="text-xl font-bold text-black">Quản Lý Danh Mục</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Thêm, sửa, xóa danh mục sản phẩm. Quản lý cấu trúc danh mục.
            </p>
            <div className="mt-4 text-black font-medium">
              Xem chi tiết →
            </div>
          </Link>

          {/* Users Management */}
          <Link 
            href="/admin/users"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200 hover:border-black"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                👥
              </div>
              <h2 className="text-xl font-bold text-black">Quản Lý Người Dùng</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Xem, sửa, xóa tài khoản người dùng. Quản lý quyền truy cập.
            </p>
            <div className="mt-4 text-black font-medium">
              Xem chi tiết →
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-black mb-4">Hoạt Động Gần Đây</h2>
          <div className="text-gray-500 text-center py-8">
            Chưa có hoạt động nào
          </div>
        </div>
      </div>
    </div>
  )
}
