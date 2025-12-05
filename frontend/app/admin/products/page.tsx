'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, productsApi, categoriesApi, type Product, type Category } from '@/lib/api'
import { prepareImageForUpload } from '@/lib/image'

export default function AdminProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: '',
    images: [] as string[]
  })

  useEffect(() => {
    const userData = authApi.getStoredUser()
    if (!userData || userData.role !== 'ADMIN') {
      router.push('/')
      return
    }
    setUser(userData)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.getProducts({ pageSize: 100 }),
        categoriesApi.getCategories()
      ])
      setProducts(productsRes.products)
      setCategories(categoriesRes.categories)
    } catch (err: any) {
      setError('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await prepareImageForUpload(file, {
      compress: true,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
      maxSizeMB: 3
    })

    if (result.success && result.data) {
      setFormData({ 
        ...formData, 
        image: result.data,
        images: [result.data] // Update both image and images array
      })
    } else {
      setError(result.error || 'Lỗi upload ảnh')
    }
  }

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const uploadedImages: string[] = []
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const result = await prepareImageForUpload(files[i], {
        compress: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
        maxSizeMB: 3
      })

      if (result.success && result.data) {
        uploadedImages.push(result.data)
      }
    }

    if (uploadedImages.length > 0) {
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...uploadedImages]
      })
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ 
      ...formData, 
      images: newImages,
      image: newImages[0] || '' // Update main image to first image in array
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        image: formData.image,
        images: formData.images
      }

      if (editingProduct) {
        await productsApi.updateProduct(editingProduct.id, productData)
        setSuccess('Cập nhật sản phẩm thành công!')
      } else {
        await productsApi.createProduct(productData)
        setSuccess('Thêm sản phẩm thành công!')
      }

      setShowModal(false)
      resetForm()
      loadData()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu sản phẩm')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId,
      image: product.image || '',
      images: product.images || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      await productsApi.deleteProduct(id)
      setSuccess('Xóa sản phẩm thành công!')
      loadData()
    } catch (err: any) {
      setError('Lỗi khi xóa sản phẩm')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      image: '',
      images: []
    })
    setEditingProduct(null)
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
          <h1 className="text-3xl font-bold text-black">Quản Lý Sản Phẩm</h1>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            + Thêm Sản Phẩm
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

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Danh mục</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Giá</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Tồn kho</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-black font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.categorySlug}</td>
                  <td className="px-4 py-3 text-black">{Number(product.price).toLocaleString()}đ</td>
                  <td className="px-4 py-3 text-black">{product.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-4">
              {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tên sản phẩm <span className="text-red-600">*</span>
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
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Giá (VNĐ) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Số lượng tồn kho <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Danh mục <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-black"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Hình ảnh sản phẩm
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
                  {editingProduct ? 'Cập Nhật' : 'Thêm Sản Phẩm'}
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
