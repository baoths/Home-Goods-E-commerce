import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

interface DecodedToken {
  userId: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Public GET requests for products and categories do not need authentication
  const isPublicGetRequest =
    method === 'GET' &&
    (pathname.startsWith('/api/products') || pathname.startsWith('/api/categories') || pathname.startsWith('/api/banners'));

  if (isPublicGetRequest) {
    return NextResponse.next();
  }

  // All other matched routes require admin authentication
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = authHeader.substring(7);

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET) as { payload: DecodedToken };
    
    // Check role from JWT token instead of querying database
    if (!payload.userId || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Attach userId to the request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/users/:path*',
    '/api/products/:path*',
    '/api/categories/:path*',
  ],
};
