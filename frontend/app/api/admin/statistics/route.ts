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

// Get admin statistics
export async function GET(request: NextRequest) {
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

    // Get statistics
    const [
      totalProducts,
      totalCategories,
      totalUsers,
      totalOrders
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.count()
    ])

    return NextResponse.json({
      statistics: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders
      }
    })

  } catch (error: any) {
    console.error('Get statistics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get statistics' },
      { status: 500 }
    )
  }
}
