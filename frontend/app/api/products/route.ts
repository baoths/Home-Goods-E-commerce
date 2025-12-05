import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
