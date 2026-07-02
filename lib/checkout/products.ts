import { getPaddlePriceId } from '@/lib/paddle/config';

export const DIRECT_CHECKOUT_SLUGS = [
  'starter',
  'growth',
  'pro',
  'scale',
  'trial',
] as const;

export type DirectCheckoutSlug = (typeof DIRECT_CHECKOUT_SLUGS)[number];

const DIRECT_CHECKOUT_PACKAGE_SLUGS: Record<
  Exclude<DirectCheckoutSlug, 'trial'>,
  string
> = {
  starter: 'starter-website-kit',
  growth: 'growth-optimization-kit',
  pro: 'pro-conversion-toolkit',
  scale: 'scale-business-bundle',
};

export const TRIAL_CHECKOUT_PRICE_ID = 'pri_01kv288raxgwa5q3t2g7c6fam1';

export function isDirectCheckoutSlug(value: string): value is DirectCheckoutSlug {
  return (DIRECT_CHECKOUT_SLUGS as readonly string[]).includes(value);
}

export function getDirectCheckoutPriceId(slug: string): string | null {
  const key = slug.trim().toLowerCase();
  if (!isDirectCheckoutSlug(key)) {
    return null;
  }
  if (key === 'trial') {
    return TRIAL_CHECKOUT_PRICE_ID;
  }
  return getPaddlePriceId(DIRECT_CHECKOUT_PACKAGE_SLUGS[key]);
}

/** /checkout/{slug} with optional trailing slash → lowercase canonical path, or null. */
export function canonicalCheckoutPath(pathname: string): string | null {
  const match = pathname.match(/^\/checkout\/([^/]+)\/?$/i);
  if (!match) {
    return null;
  }

  const slug = match[1].toLowerCase();
  if (!isDirectCheckoutSlug(slug)) {
    return null;
  }

  const canonical = `/checkout/${slug}`;
  return canonical === pathname ? null : canonical;
}
