import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/lib/container';

interface CategoryProductsParams {
  params: {
    categoryId: string;
  };
}

export async function GET(request: NextRequest, { params }: CategoryProductsParams) {
  try {
    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const products = await container.productService.getProductsByCategoryId(categoryId);

    if (!products) {
      return NextResponse.json({ error: 'Products not found for this category' }, { status: 404 });
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error(`Error fetching products for category ${params.categoryId}:`, error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
