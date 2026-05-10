import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/admin-cookie';
import { verifyAdminJwt } from '@/lib/auth/admin-jwt';
import { applyPublicOriginToRedirect, buildPublicUrl } from '@/lib/public-url';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    let valid = false;
    if (token) {
      const claims = await verifyAdminJwt(token);
      valid = Boolean(claims);
    }

    const isLoginPath = pathname === '/admin/login' || pathname.startsWith('/admin/login/');

    if (isLoginPath) {
      if (valid) {
        return NextResponse.redirect(buildPublicUrl('/admin'));
      }
      return NextResponse.next();
    }

    if (!valid) {
      const loginUrl = new URL(buildPublicUrl('/admin/login'));
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl.toString());
    }

    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);
  return applyPublicOriginToRedirect(intlResponse);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
