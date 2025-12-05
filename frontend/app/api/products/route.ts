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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const skip = (page - 1) * pageSize
    
    // Filters
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'newest'
    
    // Build where clause
    const where: any = {}
    
    if (category) {
      const categoryObj = await prisma.category.findUnique({
        where: { slug: category }
      })
      if (categoryObj) {
        where.categoryId = categoryObj.id
      }
    }
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    
    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / pageSize)
    
    return NextResponse.json({
      products: products.map(product => {
        const price = Number(product.price)
        const discount = Number(product.discount)
        const originalPrice = discount > 0 
          ? price / (1 - discount / 100)
          : price
        
        return {
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
        }
      }),
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new product (Admin only)
export async function POST(request: NextRequest) {
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

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        stock: stock || 0,
        categoryId,
        image: image || null,
        images: images || [],
        discount: discount || 0,
        featured: featured || false
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
      message: 'Product created successfully',
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
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}
