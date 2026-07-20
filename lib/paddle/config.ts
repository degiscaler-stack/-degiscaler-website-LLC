/**
 * Paddle Billing (v2) — production configuration.
 *
 * Price IDs copied exactly from the DigiScaler Paddle dashboard screenshots
 * (Starter / Growth / Pro / Scale — four EUR prices each). Never invent IDs.
 */

export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
  'live_161611987544b1027904accc5ad';

export type PricingTier =
  | 'personal'
  | 'freelancer'
  | 'agency'
  | 'enterprise';

export type ProductKey = 'starter' | 'growth' | 'pro' | 'scale';

export type PriceConfiguration = {
  amount: number;
  currency: 'EUR';
  paddlePriceId: string;
};

/**
 * Canonical tier × product → display amount + live Paddle Price ID (`pri_…`).
 * Amounts must match Paddle; checkout uses paddlePriceId only (never computed totals).
 */
export const pricingMatrix: Record<
  PricingTier,
  Record<ProductKey, PriceConfiguration>
> = {
  personal: {
    starter: {
      amount: 9.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01krxpqy3yhpm8yhaq6n19x2h5',
    },
    growth: {
      amount: 19.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01krxppkpm5wsd53fat02vn9h9',
    },
    pro: {
      amount: 29.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01krxpmw00ssf3xfmf88c71sf5',
    },
    scale: {
      amount: 49.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01krxphdej0gp3c741vj94ms96',
    },
  },
  freelancer: {
    starter: {
      amount: 14.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0bpv4fv4sbkwxr7k2637jb',
    },
    growth: {
      amount: 29.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0bwd9qrwam1wv2fmpe09sy',
    },
    pro: {
      amount: 44.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0c04apa7378ea1ghesdj4b',
    },
    scale: {
      amount: 74.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0c4fftqydjc1qxv5rz5x76',
    },
  },
  agency: {
    starter: {
      amount: 19.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0brc5mn893rgfh9j94h61e',
    },
    growth: {
      amount: 39.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0bxbtxa0ksk3qp1vjjeje2',
    },
    pro: {
      amount: 59.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0c16g2m72xdkxjgqytcfpz',
    },
    scale: {
      amount: 99.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0c5eqef0a8sb62b2h7s6sw',
    },
  },
  enterprise: {
    starter: {
      amount: 24.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0bsmvmfw38ygxqt5rm4cw2',
    },
    growth: {
      amount: 49.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0byd1cctq7r5p1a9n7xr6a',
    },
    pro: {
      amount: 74.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0c2fm19raqena9a5npjq31',
    },
    scale: {
      amount: 124.99,
      currency: 'EUR',
      paddlePriceId: 'pri_01ky0c6pfq91mgw6j6zv5p38n8',
    },
  },
};

/** @deprecated Prefer pricingMatrix — Personal slug map kept for legacy callers */
export const PADDLE_PRICE_IDS: Record<string, string> = {
  'starter-website-kit': pricingMatrix.personal.starter.paddlePriceId,
  'growth-optimization-kit': pricingMatrix.personal.growth.paddlePriceId,
  'pro-conversion-toolkit': pricingMatrix.personal.pro.paddlePriceId,
  'scale-business-bundle': pricingMatrix.personal.scale.paddlePriceId,
};

const PRODUCT_BY_SLUG: Record<string, ProductKey> = {
  'starter-website-kit': 'starter',
  starter: 'starter',
  'growth-optimization-kit': 'growth',
  growth: 'growth',
  'pro-conversion-toolkit': 'pro',
  pro: 'pro',
  'scale-business-bundle': 'scale',
  scale: 'scale',
  'scale-consultation': 'scale',
  'advanced-consultation': 'scale',
  'elite-launch-package': 'scale',
};

export const PRICING_TIERS: readonly PricingTier[] = [
  'personal',
  'freelancer',
  'agency',
  'enterprise',
] as const;

export const PRODUCT_KEYS: readonly ProductKey[] = [
  'starter',
  'growth',
  'pro',
  'scale',
] as const;

export function isPricingTier(value: string): value is PricingTier {
  return (PRICING_TIERS as readonly string[]).includes(value);
}

export function isProductKey(value: string): value is ProductKey {
  return (PRODUCT_KEYS as readonly string[]).includes(value);
}

export function productKeyFromSlug(slug: string): ProductKey | null {
  return PRODUCT_BY_SLUG[slug.trim().toLowerCase()] ?? null;
}

export function getPriceConfiguration(
  tier: PricingTier,
  product: ProductKey,
): PriceConfiguration {
  return pricingMatrix[tier][product];
}

/** Display label matching Paddle EUR amounts (e.g. €9.99). */
export function formatEuroAmount(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

export function getDisplayPrice(tier: PricingTier, product: ProductKey): string {
  return formatEuroAmount(pricingMatrix[tier][product].amount);
}

export function getPaddlePriceIdForTierProduct(
  tier: PricingTier,
  product: ProductKey,
): string {
  return pricingMatrix[tier][product].paddlePriceId;
}

/**
 * Returns the Paddle price ID for a package slug + optional customer tier.
 * Defaults to Personal (legacy short checkout links and older callers).
 */
export function getPaddlePriceId(
  slug: string,
  tier: PricingTier = 'personal',
): string | null {
  const product = productKeyFromSlug(slug);
  if (!product) return null;
  return pricingMatrix[tier][product].paddlePriceId;
}
