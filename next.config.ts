import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** No remote image domains — testimonials and other visuals use CSS / local assets only. */
const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
