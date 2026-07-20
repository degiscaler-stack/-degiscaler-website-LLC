import {
  getPaddlePriceIdForTierProduct,
  isPricingTier,
  isProductKey,
  type PricingTier,
  type ProductKey,
} from '@/lib/paddle/config';

export const DIRECT_CHECKOUT_PRODUCTS = [
  'starter',
  'growth',
  'pro',
  'scale',
] as const satisfies readonly ProductKey[];

export const DIRECT_CHECKOUT_TIERS = [
  'personal',
  'freelancer',
  'agency',
  'enterprise',
] as const satisfies readonly PricingTier[];

/** Short Personal routes + trial (legacy). */
export const DIRECT_CHECKOUT_SLUGS = [
  'starter',
  'growth',
  'pro',
  'scale',
  'trial',
] as const;

export type DirectCheckoutSlug = (typeof DIRECT_CHECKOUT_SLUGS)[number];
export type DirectCheckoutProduct = ProductKey;
export type DirectCheckoutTier = PricingTier;

export const TRIAL_CHECKOUT_PRICE_ID = 'pri_01kv288raxgwa5q3t2g7c6fam1';

export function isDirectCheckoutSlug(value: string): value is DirectCheckoutSlug {
  return (DIRECT_CHECKOUT_SLUGS as readonly string[]).includes(value);
}

export function isDirectCheckoutProduct(value: string): value is ProductKey {
  return isProductKey(value);
}

export function isDirectCheckoutTier(value: string): value is PricingTier {
  return isPricingTier(value);
}

/**
 * Resolve Paddle Price ID for a direct checkout.
 * Short `/checkout/{product}` paths are always Personal.
 */
export function getDirectCheckoutPriceId(
  productOrSlug: string,
  tier: PricingTier = 'personal',
): string | null {
  const key = productOrSlug.trim().toLowerCase();
  if (key === 'trial') {
    return TRIAL_CHECKOUT_PRICE_ID;
  }
  if (!isProductKey(key)) {
    return null;
  }
  return getPaddlePriceIdForTierProduct(tier, key);
}

/** Public path for a tier × product checkout (Personal uses short URLs). */
export function directCheckoutPath(tier: PricingTier, product: ProductKey): string {
  if (tier === 'personal') {
    return `/checkout/${product}`;
  }
  return `/checkout/${tier}/${product}`;
}

/**
 * Normalize checkout path casing / trailing slash.
 * Returns canonical path when different from input, else null.
 */
export function canonicalCheckoutPath(pathname: string): string | null {
  const trial = pathname.match(/^\/checkout\/(trial)\/?$/i);
  if (trial) {
    const canonical = '/checkout/trial';
    return canonical === pathname ? null : canonical;
  }

  const personal = pathname.match(/^\/checkout\/(starter|growth|pro|scale)\/?$/i);
  if (personal) {
    const product = personal[1].toLowerCase();
    const canonical = `/checkout/${product}`;
    return canonical === pathname ? null : canonical;
  }

  const tiered = pathname.match(
    /^\/checkout\/(freelancer|agency|enterprise)\/(starter|growth|pro|scale)\/?$/i,
  );
  if (tiered) {
    const tier = tiered[1].toLowerCase();
    const product = tiered[2].toLowerCase();
    const canonical = `/checkout/${tier}/${product}`;
    return canonical === pathname ? null : canonical;
  }

  return null;
}
