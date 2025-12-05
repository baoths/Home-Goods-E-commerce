'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, categoriesApi, type Category } from '@/lib/api'
import { prepareImageForUpload } from '@/lib/image'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    const userData = authApi.getStoredUser()
    if (!userData || userData.role !== 'ADMIN') {
      router.push('/')
      return
    }
    setUser(userData)
    loadCategories()
  }, [router])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await categoriesApi.getCategories()
      setCategories(res.categories)
    } catch (err: any) {
      setError('Không thể tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await prepareImageForUpload(file, {
      compress: true,
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.8,
      maxSizeMB: 2
    })

    if (result.success && result.data) {
      setFormData({ ...formData, image: result.data })
    } else {
      setError(result.error || 'Lỗi upload ảnh')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, formData)
        setSuccess('Cập nhật danh mục thành công!')
      } else {
        await categoriesApi.createCategory(formData)
        setSuccess('Thêm danh mục thành công!')
      }

      setShowModal(false)
      resetForm()
      loadCategories()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu danh mục')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này? Tất cả sản phẩm trong danh mục sẽ không có danh mục.')) return

    try {
      await categoriesApi.deleteCategory(id)
      setSuccess('Xóa danh mục thành công!')
      loadCategories()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa danh mục')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: ''
    })
    setEditingCategory(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
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
          <h1 className="text-3xl font-bold text-black">Quản Lý Danh Mục</h1>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            + Thêm Danh Mục
          </button>
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              {category.image && (
                <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-black mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Slug: {category.slug}</p>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Chưa có danh mục nào</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-black mb-4">
              {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tên danh mục <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Slug (URL) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Tự động tạo từ tên danh mục</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-semibold"
                >
                  {editingCategory ? 'Cập Nhật' : 'Thêm Danh Mục'}
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
