import { NextResponse, NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/admin-cookie';
import { verifyAdminJwt } from '@/lib/auth/admin-jwt';
import { applyCheckoutNoCacheHeaders } from '@/lib/checkout/no-cache';
import { canonicalCheckoutPath } from '@/lib/checkout/products';
import { buildPublicUrl } from '@/lib/public-url';

const LEGACY_LOCALE_PREFIXES = new Set(['en', 'fr', 'ar', 'de']);

/** /{locale}/... → /... for legacy multilingual URLs only. */
function stripLocalePrefix(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})(?:-[a-z]{2})?(\/.*)?$/i);
  if (!match) {
    return null;
  }

  const locale = match[1].toLowerCase();
  if (!LEGACY_LOCALE_PREFIXES.has(locale)) {
    return null;
  }

  return match[2] || '/';
}

function checkoutRedirect(pathname: string, search: string): NextResponse {
  const redirectUrl = new URL(buildPublicUrl(pathname));
  redirectUrl.search = search;
  return applyCheckoutNoCacheHeaders(
    NextResponse.redirect(redirectUrl.toString(), 308),
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let req = request;
  if (pathname.startsWith('/admin')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ds-admin-path', pathname);
    const chatId = request.nextUrl.searchParams.get('c')?.trim();
    if (chatId) requestHeaders.set('x-ds-admin-chat-id', chatId);
    req = new NextRequest(request.url, { headers: requestHeaders });
  }

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

  const unprefixed = stripLocalePrefix(pathname);
  if (unprefixed && unprefixed !== pathname) {
    return checkoutRedirect(unprefixed, request.nextUrl.search);
  }

  const normalizedCheckout = canonicalCheckoutPath(pathname);
  if (normalizedCheckout) {
    return checkoutRedirect(normalizedCheckout, request.nextUrl.search);
  }

  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
    return applyCheckoutNoCacheHeaders(NextResponse.next());
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
      return NextResponse.next({ request: { headers: req.headers } });
    }

    if (!valid) {
      const loginUrl = new URL(buildPublicUrl('/admin/login'));
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl.toString());
    }

    return NextResponse.next({ request: { headers: req.headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
