import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/lib/container';
import { z } from 'zod';
import { UserRole } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Get all users (Admin only)
export async function getAllUsersHandler(request: NextRequest) {
  try {
    const users = await container.userService.getAllUsers();

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get users' },
      { status: 500 }
    );
  }
}

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

// Helper to get current user ID from token
function getCurrentUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function getUserByIdHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const targetUser = await container.userService.getUserById(params.id);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: targetUser });
  } catch (error: any) {
    console.error(`Get user ${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

export async function updateUserHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUserId = getCurrentUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    // Prevent admin from changing their own role
    if (params.id === currentUserId && validation.data.role) {
      const user = await container.userService.getUserById(params.id);
      if (user && validation.data.role !== user.role) {
        return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
      }
    }

    const updatedUser = await container.userService.updateUser(params.id, validation.data);

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser });

  } catch (error: any) {
    console.error(`Update user ${params.id} error:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function deleteUserHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUserId = getCurrentUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (params.id === currentUserId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await container.userService.deleteUser(params.id);

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error: any) {
    console.error(`Delete user ${params.id} error:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
