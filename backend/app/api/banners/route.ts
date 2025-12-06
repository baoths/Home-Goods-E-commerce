import { getAllBannersHandler, createBannerHandler } from '@/modules/banners/banners.controller';

// This route is public for GET, but creating a banner (POST) will be protected by middleware.
export const GET = getAllBannersHandler;
export const POST = createBannerHandler;
