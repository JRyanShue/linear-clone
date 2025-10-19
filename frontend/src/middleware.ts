import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has a Firebase auth token cookie
  const sessionCookie = request.cookies.get('__session');
  const hasAuthCookie = !!sessionCookie?.value;

  // If user is on the login page (/) and is authenticated, redirect to dashboard
  if (pathname === '/' && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is trying to access dashboard without being authenticated, redirect to login
  if (pathname.startsWith('/dashboard') && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
