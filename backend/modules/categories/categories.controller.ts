import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/lib/container';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
});

export async function getAllCategoriesHandler() {
  try {
    const categories = await container.categoryService.getAllCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new category (Admin only)
export async function createCategoryHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = categorySchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 })
    }

    const category = await container.categoryService.createCategory(validation.data)

    return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 })

  } catch (error: any) {
    console.error('Create category error:', error)
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'A category with this name already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

const updateCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
});

export async function getCategoryByIdHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await container.categoryService.getCategoryById(params.id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error(`Get category ${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to get category' }, { status: 500 });
  }
}

export async function updateCategoryHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const category = await container.categoryService.updateCategory(params.id, validation.data);

    return NextResponse.json({ message: 'Category updated successfully', category });

  } catch (error: any) {
    console.error(`Update category ${params.id} error:`, error);
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'A category with this name already exists.' }, { status: 409 });
    }
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function deleteCategoryHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await container.categoryService.deleteCategory(params.id);

    return NextResponse.json({ message: 'Category deleted successfully' });

  } catch (error: any) {
    console.error(`Delete category ${params.id} error:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
