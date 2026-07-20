/**
 * Customer-tier pricing matrix (Personal → Enterprise).
 * Mirrors the IPTV multi-option selector pattern: one active tab updates all four kit cards.
 */

export const CUSTOMER_TIERS = [
  'personal',
  'freelancer',
  'agency',
  'enterprise',
] as const;

export type CustomerTier = (typeof CUSTOMER_TIERS)[number];

export const DEFAULT_CUSTOMER_TIER: CustomerTier = 'personal';

export const CUSTOMER_TIER_LABELS: Record<CustomerTier, string> = {
  personal: 'Personal',
  freelancer: 'Freelancer',
  agency: 'Agency',
  enterprise: 'Enterprise',
};

export const PLAN_KEYS = ['starter', 'growth', 'pro', 'scale'] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

/** Canonical package slug for each plan card */
export const PLAN_SLUG_BY_KEY: Record<PlanKey, string> = {
  starter: 'starter-website-kit',
  growth: 'growth-optimization-kit',
  pro: 'pro-conversion-toolkit',
  scale: 'scale-business-bundle',
};

const SLUG_TO_PLAN: Record<string, PlanKey> = {
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

/** Display prices by customer tier × plan */
export const TIER_DISPLAY_PRICES: Record<CustomerTier, Record<PlanKey, string>> = {
  personal: {
    starter: '€9.99',
    growth: '€19.99',
    pro: '€29.99',
    scale: '€49.99',
  },
  freelancer: {
    starter: '€14.99',
    growth: '€29.99',
    pro: '€44.99',
    scale: '€74.99',
  },
  agency: {
    starter: '€19.99',
    growth: '€39.99',
    pro: '€59.99',
    scale: '€99.99',
  },
  enterprise: {
    starter: '€24.99',
    growth: '€49.99',
    pro: '€74.99',
    scale: '€124.99',
  },
};

export function isCustomerTier(value: string): value is CustomerTier {
  return (CUSTOMER_TIERS as readonly string[]).includes(value);
}

export function planKeyFromSlug(slug: string): PlanKey | null {
  return SLUG_TO_PLAN[slug.trim().toLowerCase()] ?? null;
}

export function displayPriceFor(tier: CustomerTier, slug: string): string | null {
  const plan = planKeyFromSlug(slug);
  if (!plan) return null;
  return TIER_DISPLAY_PRICES[tier][plan];
}
