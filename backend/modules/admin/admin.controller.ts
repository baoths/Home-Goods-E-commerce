import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/lib/container';

// Get admin statistics
export async function GET(request: NextRequest) {
  try {
    const statistics = await container.adminService.getStatistics();

    return NextResponse.json({ statistics });
  } catch (error: any) {
    console.error('Get statistics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get statistics' },
      { status: 500 }
    )
  }
}
