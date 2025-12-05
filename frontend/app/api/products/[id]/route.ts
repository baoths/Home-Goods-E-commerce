import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Helper function to verify admin
function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const price = Number(product.price)
    const discount = Number(product.discount)
    const originalPrice = discount > 0 ? price / (1 - discount / 100) : price

    return NextResponse.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price,
      originalPrice,
      discount,
      stock: product.stock,
      image: product.image,
      images: product.images,
      featured: product.featured,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      categorySlug: product.category.slug,
      createdAt: product.createdAt
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin
    const decoded = verifyAdmin(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and check if admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, price, stock, categoryId, image, images, discount, featured } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Generate new slug if name changed
    let slug = existingProduct.slug
    if (name && name !== existingProduct.name) {
      slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        slug,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? price : undefined,
        stock: stock !== undefined ? stock : undefined,
        categoryId: categoryId || undefined,
        image: image !== undefined ? image : undefined,
        images: images !== undefined ? images : undefined,
        discount: discount !== undefined ? discount : undefined,
        featured: featured !== undefined ? featured : undefined
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        image: product.image,
        images: product.images,
        discount: Number(product.discount),
        featured: product.featured,
        categoryId: product.categoryId,
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        createdAt: product.createdAt
      }
    })

  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

// Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin
    const decoded = verifyAdmin(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and check if admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Product deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}
