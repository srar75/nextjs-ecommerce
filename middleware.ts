import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const protectedRoutes = ['/profile', '/checkout', '/orders'];
  const adminRoutes = ['/admin'];
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  if (isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
    }
    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
