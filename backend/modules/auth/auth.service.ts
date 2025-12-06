import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async registerUser(data: any) {
    const { email, password, name } = data;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  }

  async loginUser(credentials: any) {
    const { email, password } = credentials;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Include role in JWT token for middleware to verify without database query
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return { user, token };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUserProfile(userId: string, data: any) {
    const { name, phone, address, avatar } = data;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        avatarUrl: avatar,
      },
    });
  }
}

export const authService = new AuthService(prisma);
