import { NextResponse } from 'next/server';

export const CHECKOUT_CACHE_CONTROL =
  'no-store, no-cache, must-revalidate, proxy-revalidate';

/** Response headers that prevent browsers and CDNs from caching checkout pages. */
export const CHECKOUT_NO_CACHE_HEADERS = {
  'Cache-Control': CHECKOUT_CACHE_CONTROL,
  Pragma: 'no-cache',
  Expires: '0',
} as const;

export function applyCheckoutNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', CHECKOUT_CACHE_CONTROL);
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}
