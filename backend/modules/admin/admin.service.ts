import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

export class AdminService {
  constructor(private prisma: PrismaClient) {}

  async getStatistics() {
    const [
      userCount,
      productCount,
      categoryCount,
      orderCount,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count(),
      this.prisma.category.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: {
          finalAmount: true,
        },
      }),
    ]);

    return {
      users: userCount,
      products: productCount,
      categories: categoryCount,
      orders: orderCount,
      revenue: totalRevenue._sum.finalAmount || 0,
    };
  }
}

export const adminService = new AdminService(prisma);
