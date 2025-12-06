import { getProductByIdHandler, updateProductHandler, deleteProductHandler } from '@/modules/products/products.controller';

export const GET = getProductByIdHandler;
export const PUT = updateProductHandler;
export const DELETE = deleteProductHandler;
