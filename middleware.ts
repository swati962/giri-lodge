import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Temporarily bypass all middleware for testing
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
