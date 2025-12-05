'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { prepareImageForUpload } from '@/lib/image'

export default function AdminProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    discount: '0',
    stock: '0',
    featured: false,
  })
  
  const [mainImage, setMainImage] = useState<string>('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  // Handle main image upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await prepareImageForUpload(file, {
      compress: true,
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.85
    })

    if (result.success && result.data) {
      setMainImage(result.data)
      setError('')
    } else {
      setError(result.error || 'Failed to process image')
    }
  }

  // Handle gallery images upload
  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const processedImages: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const result = await prepareImageForUpload(files[i], {
        compress: true,
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85
      })

      if (result.success && result.data) {
        processedImages.push(result.data)
      }
    }

    setGalleryImages([...galleryImages, ...processedImages])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mainImage) {
      setError('Please upload a main product image')
      return
    }

    setLoading(true)
    setError('')

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock),
        image: mainImage,
        images: galleryImages,
      }

      // TODO: Call API to create product
      console.log('Product data:', productData)
      
      // Simulated success
      alert('Product created successfully!')
      router.push('/admin/products')
      
    } catch (err) {
      setError('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tạo Sản Phẩm Mới</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tồn kho
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                Sản phẩm nổi bật
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Main Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh chính * (sẽ chuyển sang Base64)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {mainImage && (
              <div className="mt-2">
                <img src={mainImage} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Gallery Images Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh thư viện (nhiều ảnh - Base64)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {galleryImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {galleryImages.map((img, idx) => (
                  <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
