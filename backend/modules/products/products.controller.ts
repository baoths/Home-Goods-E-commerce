import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/lib/container';
import { z } from 'zod';

const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
  category: z.string().optional(),
  featured: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('newest'),
})

export async function getAllProductsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = searchParamsSchema.safeParse(queryParams)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const data = await container.productService.getAllProducts(validation.data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').optional().default(0),
  categoryId: z.string().cuid('Invalid category ID'),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional().default([]),
  discount: z.coerce.number().min(0).max(100).optional().default(0),
  featured: z.boolean().optional().default(false),
})

// Create new product (Admin only)
export async function createProductHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = productSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { name, ...rest } = validation.data;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProductData = { name, slug, ...rest };

    const product = await container.productService.createProduct(newProductData);

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });

  } catch (error: any) {
    console.error('Create product error:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        return NextResponse.json(
          { error: 'A product with this name already exists, leading to a duplicate slug.' },
          { status: 409 }
        )
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

const updateProductSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive('Price must be positive').optional(),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative').optional(),
    categoryId: z.string().cuid('Invalid category ID').optional(),
    imageUrl: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
    discount: z.coerce.number().min(0).max(100).optional(),
    featured: z.boolean().optional(),
});

export async function getProductByIdHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await container.productService.getProductById(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error(`Get product ${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to get product' }, { status: 500 });
  }
}

export async function updateProductHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const product = await container.productService.updateProduct(params.id, validation.data);

    return NextResponse.json({ message: 'Product updated successfully', product });

  } catch (error: any) {
    console.error(`Update product ${params.id} error:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function deleteProductHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await container.productService.deleteProduct(params.id);

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error: any) {
    console.error(`Delete product ${params.id} error:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
