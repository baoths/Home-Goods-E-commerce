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

// Update category (Admin only)
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
    const { name, slug, description, image } = body

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if new slug conflicts with another category
    if (slug && slug !== existingCategory.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug }
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
        description: description !== undefined ? description : undefined,
        image: image !== undefined ? image : undefined
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json({
      message: 'Category updated successfully',
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: category._count.products
      }
    })

  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    )
  }
}

// Delete category (Admin only)
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${existingCategory._count.products} products` },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Category deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}
