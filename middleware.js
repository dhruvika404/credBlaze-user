import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('token');
  const { pathname } = request.nextUrl;
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/email-verify') ||
    pathname.startsWith('/enter-code') ||
    pathname.startsWith('/successfully-message') ||
    pathname.startsWith('/create-password') ||
    pathname.startsWith('/mobile-capture');

  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If already logged in, redirect away from root (login)
  if (authToken && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
};
