import { NextResponse } from 'next/server';

export const CHECKOUT_CACHE_CONTROL =
  'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';

/** Bumped on each production publish — used to verify Hostinger deployed the latest build. */
export const CHECKOUT_DEPLOY_REVISION = '4';

/** Response headers that prevent browsers and CDNs from caching checkout pages. */
export const CHECKOUT_NO_CACHE_HEADERS = {
  'Cache-Control': CHECKOUT_CACHE_CONTROL,
  'CDN-Cache-Control': 'no-store',
  'Surrogate-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Checkout-Deploy': CHECKOUT_DEPLOY_REVISION,
} as const;

export function applyCheckoutNoCacheHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(CHECKOUT_NO_CACHE_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}
