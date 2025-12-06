import { prisma } from '@/lib/prisma';
import { Prisma, PrismaClient } from '@prisma/client';

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getAllProducts(params: {
    page?: number;
    pageSize?: number;
    category?: string | null;
    featured?: string | null;
    search?: string | null;
    sortBy?: string | null;
  }) {
    const {
      page = 1,
      pageSize = 20,
      category,
      featured,
      search,
      sortBy = 'newest',
    } = params;

    const skip = (page - 1) * pageSize;
    
    const where: Prisma.ProductWhereInput = {};
    
    if (category) {
      const categoryObj = await this.prisma.category.findUnique({
        where: { slug: category },
      });
      if (categoryObj) {
        where.categoryId = categoryObj.id;
      }
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
    }
    
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / pageSize);

    return { products, pagination: { page, pageSize, total, totalPages } };
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async getProductsByCategoryId(categoryId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async createProduct(data: any) {
    const { name, slug, description, price, discount, stock, imageUrl, imageUrls, featured, categoryId } = data;
    return this.prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discount,
        stock,
        imageUrl,
        imageUrls,
        featured,
        categoryId,
      },
    });
  }

  async updateProduct(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService(prisma);
