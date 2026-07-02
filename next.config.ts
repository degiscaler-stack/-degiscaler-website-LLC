import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { CHECKOUT_NO_CACHE_HEADERS } from './lib/checkout/no-cache';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const checkoutNoCacheHeaderEntries = Object.entries(CHECKOUT_NO_CACHE_HEADERS).map(
  ([key, value]) => ({ key, value }),
);

/** No remote image domains — testimonials and other visuals use CSS / local assets only. */
const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/checkout',
      headers: checkoutNoCacheHeaderEntries,
    },
    {
      source: '/checkout/:path*',
      headers: checkoutNoCacheHeaderEntries,
    },
  ],
};

export default withNextIntl(nextConfig);
