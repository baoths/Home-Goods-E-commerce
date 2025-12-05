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

// Update user (Admin only)
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

    // Get current user and check if admin
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, phone, address, role } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent changing own role
    if (params.id === currentUser.id && role && role !== currentUser.role) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        role: role || undefined
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

// Delete user (Admin only)
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

    // Get current user and check if admin
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting yourself
    if (params.id === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
