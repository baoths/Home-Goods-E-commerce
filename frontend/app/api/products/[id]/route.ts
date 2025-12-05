import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
