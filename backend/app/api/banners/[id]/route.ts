import { 
    getBannerByIdHandler, 
    updateBannerHandler, 
    deleteBannerHandler 
} from '@/modules/banners/banners.controller';

// These routes are for admin only and will be protected by middleware.
export const GET = getBannerByIdHandler;
export const PUT = updateBannerHandler;
export const DELETE = deleteBannerHandler;
export const dynamic = 'force-dynamic';
