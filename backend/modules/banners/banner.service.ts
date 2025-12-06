import { Prisma, PrismaClient } from '@prisma/client';

export class BannerService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Get all banners.
   * @param onlyActive - If true, returns only active banners, sorted by order.
   */
  async getAllBanners(onlyActive = false) {
    const where: Prisma.BannerWhereInput = {};
    if (onlyActive) {
      where.active = true;
    }

    return this.prisma.banner.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
    });
  }

  /**
   * Get a single banner by its ID.
   * @param id - The ID of the banner.
   */
  async getBannerById(id: string) {
    return this.prisma.banner.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new banner.
   * @param data - The data for the new banner.
   */
  async createBanner(data: Prisma.BannerCreateInput) {
    return this.prisma.banner.create({
      data,
    });
  }

  /**
   * Update an existing banner.
   * @param id - The ID of the banner to update.
   * @param data - The data to update.
   */
  async updateBanner(id: string, data: Prisma.BannerUpdateInput) {
    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a banner.
   * @param id - The ID of the banner to delete.
   */
  async deleteBanner(id: string) {
    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
