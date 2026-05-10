import { NextResponse } from 'next/server';

const DEFAULT_PUBLIC_ORIGIN = 'https://degiscaler.com';

/**
 * Normalizes NEXT_PUBLIC_SITE_URL (or similar) to an origin string:
 * trailing slashes removed, non-local :3000 stripped, https forced off localhost.
 */
export function normalizeConfiguredOrigin(raw: string): string {
  let s = raw.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`;
  }
  const u = new URL(s);
  const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  const protocol = local ? u.protocol : 'https:';
  const hostname = u.hostname;
  let port = u.port;
  if (!local && port === '3000') {
    port = '';
  }
  const portSuffix = port ? `:${port}` : '';
  return `${protocol}//${hostname}${portSuffix}`;
}

/**
 * Canonical browser-facing origin for redirects. Never use request.url / nextUrl.origin for Location headers in production.
 */
export function getPublicOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return normalizeConfiguredOrigin(configured);
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return DEFAULT_PUBLIC_ORIGIN;
}

/** Absolute public URL for a path beginning with `/`. */
export function buildPublicUrl(path: string): string {
  const origin = getPublicOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${p}`;
}

/** Rebuild a redirect Location (absolute or relative) using the clean public origin so ports like :3000 never leak to clients. */
export function rewriteLocationHeaderToPublicOrigin(locationHeader: string): string {
  try {
    const parsed = new URL(locationHeader, `${getPublicOrigin()}/`);
    const pathPart = parsed.pathname + parsed.search + parsed.hash;
    return buildPublicUrl(pathPart);
  } catch {
    return locationHeader;
  }
}

/** Fix Location on redirect responses (e.g. next-intl) after syncCookie / headers run. */
export function applyPublicOriginToRedirect(response: NextResponse): NextResponse {
  if (response.status < 300 || response.status >= 400) return response;
  const loc = response.headers.get('location');
  if (!loc) return response;
  response.headers.set('Location', rewriteLocationHeaderToPublicOrigin(loc));
  return response;
}
