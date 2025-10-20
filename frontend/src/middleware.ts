import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Public routes
  const isPublicRoute = pathname === '/';

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If authenticated and trying to access login page
  if (isAuthenticated && pathname === '/') {
    // Redirect authenticated users to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
