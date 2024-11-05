import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';
  
  // Get the token from the cookies
  const isAuthenticated = request.cookies.get('user')?.value;

  // Redirect to login if accessing protected route without authentication
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  // Redirect to chat if accessing public route while authenticated
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/chat',
    '/chat/:path*',
  ],
};