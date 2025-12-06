import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/lib/container';
import { z } from 'zod';

// Schema for creating and updating a banner
const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  link: z.string().optional(),
  order: z.coerce.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

/**
 * Handler to get all banners.
 * Public route can get only active banners.
 * Admin route can get all banners.
 */
export async function getAllBannersHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // A query param to decide if we should fetch all banners or only active ones.
    // The middleware will ensure only admins can set this to 'false'.
    const includeInactive = searchParams.get('active') === 'all';
    
    const banners = await container.bannerService.getAllBanners(!includeInactive);
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handler to create a new banner. (Admin only)
 */
export async function createBannerHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = bannerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const banner = await container.bannerService.createBanner(validation.data);
    return NextResponse.json({ message: 'Banner created successfully', banner }, { status: 201 });
  } catch (error: any) {
    console.error('Create banner error:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}

/**
 * Handler to get a single banner by ID. (Admin only)
 */
export async function getBannerByIdHandler(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const banner = await container.bannerService.getBannerById(params.id);
        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }
        return NextResponse.json({ banner });
    } catch (error) {
        console.error(`Get banner ${params.id} error:`, error);
        return NextResponse.json({ error: 'Failed to get banner' }, { status: 500 });
    }
}

/**
 * Handler to update a banner. (Admin only)
 */
export async function updateBannerHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    // Use partial schema for updates
    const validation = bannerSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const banner = await container.bannerService.updateBanner(params.id, validation.data);
    return NextResponse.json({ message: 'Banner updated successfully', banner });
  } catch (error: any) {
    console.error(`Update banner ${params.id} error:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

/**
 * Handler to delete a banner. (Admin only)
 */
export async function deleteBannerHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await container.bannerService.deleteBanner(params.id);
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    console.error(`Delete banner ${params.id} error:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
