'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, usersApi } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'CUSTOMER'
  })

  useEffect(() => {
    const userData = authApi.getStoredUser()
    if (!userData || userData.role !== 'ADMIN') {
      router.push('/')
      return
    }
    setCurrentUser(userData)
    loadUsers()
  }, [router])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await usersApi.getUsers()
      setUsers(response.users as any)
    } catch (err: any) {
      setError('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingUser) {
        await usersApi.updateUser(editingUser.id, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          role: formData.role as 'ADMIN' | 'CUSTOMER'
        })
        setSuccess('Cập nhật người dùng thành công!')
      }

      setShowModal(false)
      resetForm()
      loadUsers()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu người dùng')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return

    try {
      await usersApi.deleteUser(id)
      setSuccess('Xóa người dùng thành công!')
      loadUsers()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa người dùng')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'CUSTOMER'
    })
    setEditingUser(null)
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-xl font-semibold text-black">Đang tải...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white text-sm">
        <div className="container mx-auto px-4 py-2">
          <Link href="/admin" className="hover:text-gray-300">← Quay lại Dashboard</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Quản Lý Người Dùng</h1>
        </div>

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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Vai trò</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Chưa có người dùng nào (Cần tạo API endpoint để lấy danh sách users)
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-black">{user.email}</td>
                    <td className="px-4 py-3 text-black font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.role === 'ADMIN' ? '👨‍💼 Admin' : '👤 Khách hàng'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        ✏️ Sửa
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️ Xóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-black mb-4">Sửa Thông Tin Người Dùng</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tên <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Địa chỉ
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Vai trò <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                  disabled={editingUser.id === currentUser?.id}
                >
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {editingUser.id === currentUser?.id && (
                  <p className="text-xs text-gray-500 mt-1">Không thể thay đổi vai trò của chính mình</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Cập Nhật
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 border border-gray-300 text-black py-3 rounded-lg hover:bg-gray-100 font-semibold"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
