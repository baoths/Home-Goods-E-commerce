import { getCategoryByIdHandler, updateCategoryHandler, deleteCategoryHandler } from '@/modules/categories/categories.controller';

export const GET = getCategoryByIdHandler;
export const PUT = updateCategoryHandler;
export const DELETE = deleteCategoryHandler;

