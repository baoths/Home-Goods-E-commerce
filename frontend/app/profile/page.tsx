'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { prepareImageForUpload } from '@/lib/image'
import { authApi } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  
  const [avatar, setAvatar] = useState<string>('')

  useEffect(() => {
    const userData = authApi.getStoredUser()
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(userData)
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
    })
    // Set avatar or use initials
    setAvatar(userData.avatar || '')
  }, [router])

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle avatar upload and convert to base64
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    const result = await prepareImageForUpload(file, {
      compress: true,
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.8,
      maxSizeMB: 2
    })

    if (result.success && result.data) {
      setAvatar(result.data)
      setSuccess('Avatar uploaded successfully! (Base64)')
      
      // TODO: Call API to update avatar
      console.log('Avatar base64 length:', result.data.length)
      
    } else {
      setError(result.error || 'Failed to upload avatar')
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Call API to update profile
      const response = await authApi.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        avatar: avatar
      })
      
      setSuccess(response.message || 'Cập nhật thông tin thành công!')
      
      // Update local user state
      setUser(response.user)
      
      // Reload page after 1 second to update header
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (err: any) {
      setError(err.message || 'Cập nhật thông tin thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-semibold text-black">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <header className="border-b bg-white sticky top-0 z-50">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-black"
                />
                <button className="absolute right-0 top-0 bottom-0 px-6 bg-black text-white rounded-r-lg hover:bg-gray-800">
                  Tìm
                </button>
              </div>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <span className="text-sm font-medium text-black">Giỏ hàng</span>
              </Link>
              <div className="relative group">
                <button className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                  {/* Avatar or Initials */}
                  {avatar ? (
                    <img
                      src={avatar}
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
                  <Link href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100 bg-gray-50">
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

          {/* Category Menu */}
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

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-black">Thông Tin Cá Nhân</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-black"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center font-bold text-4xl border-4 border-gray-300">
                  {getInitials(user.name)}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click vào icon để đổi avatar</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Họ tên
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                required
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                value={formData.email}
              />
              <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Địa chỉ
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black resize-none"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
