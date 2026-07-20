/**
 * Paddle Billing (v2) — production configuration.
 *
 * The token below is the live client-side token (safe to ship in client bundles).
 * Override it via NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in .env.local or your host panel.
 */

import {
  type CustomerTier,
  type PlanKey,
  PLAN_SLUG_BY_KEY,
  planKeyFromSlug,
} from '@/lib/pricing/customer-tiers';

// Public client-side token — NOT a secret. Using a literal fallback ensures
// checkout works on every deployment without extra environment setup.
export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
  'live_161611987544b1027904accc5ad';

/** Canonical package slug → Paddle Billing EUR price ID (Personal tier / legacy) */
export const PADDLE_PRICE_IDS: Record<string, string> = {
  'starter-website-kit': 'pri_01krxpqy3yhpm8yhaq6n19x2h5',
  'growth-optimization-kit': 'pri_01krxppkpm5wsd53fat02vn9h9',
  'pro-conversion-toolkit': 'pri_01krxpmw00ssf3xfmf88c71sf5',
  'scale-business-bundle': 'pri_01krxphdej0gp3c741vj94ms96',
};

const SCALE_BUSINESS_BUNDLE_PRICE_ID = 'pri_01krxphdej0gp3c741vj94ms96';

/**
 * Hardcoded Paddle price IDs for every customer tier × plan.
 * Personal uses live production IDs. Paste Freelancer / Agency / Enterprise
 * `pri_…` IDs from the Paddle dashboard into the empty strings below
 * (or set the matching NEXT_PUBLIC_PADDLE_PRICE_* env vars).
 */
const HARDCODED_TIER_PRICE_IDS: Record<CustomerTier, Record<PlanKey, string>> = {
  personal: {
    starter: 'pri_01krxpqy3yhpm8yhaq6n19x2h5',
    growth: 'pri_01krxppkpm5wsd53fat02vn9h9',
    pro: 'pri_01krxpmw00ssf3xfmf88c71sf5',
    scale: 'pri_01krxphdej0gp3c741vj94ms96',
  },
  freelancer: {
    starter: '',
    growth: '',
    pro: '',
    scale: '',
  },
  agency: {
    starter: '',
    growth: '',
    pro: '',
    scale: '',
  },
  enterprise: {
    starter: '',
    growth: '',
    pro: '',
    scale: '',
  },
};

function envPriceId(tier: CustomerTier, plan: PlanKey): string | undefined {
  const key = `NEXT_PUBLIC_PADDLE_PRICE_${tier.toUpperCase()}_${plan.toUpperCase()}`;
  const value = process.env[key]?.trim();
  return value || undefined;
}

function resolveTierPriceId(tier: CustomerTier, plan: PlanKey): string {
  return envPriceId(tier, plan) || HARDCODED_TIER_PRICE_IDS[tier][plan] || '';
}

/** Resolved Paddle price IDs for every customer tier × plan (env overrides hardcoded). */
export const PADDLE_PRICE_IDS_BY_TIER: Record<
  CustomerTier,
  Record<PlanKey, string>
> = {
  personal: {
    starter: resolveTierPriceId('personal', 'starter'),
    growth: resolveTierPriceId('personal', 'growth'),
    pro: resolveTierPriceId('personal', 'pro'),
    scale: resolveTierPriceId('personal', 'scale'),
  },
  freelancer: {
    starter: resolveTierPriceId('freelancer', 'starter'),
    growth: resolveTierPriceId('freelancer', 'growth'),
    pro: resolveTierPriceId('freelancer', 'pro'),
    scale: resolveTierPriceId('freelancer', 'scale'),
  },
  agency: {
    starter: resolveTierPriceId('agency', 'starter'),
    growth: resolveTierPriceId('agency', 'growth'),
    pro: resolveTierPriceId('agency', 'pro'),
    scale: resolveTierPriceId('agency', 'scale'),
  },
  enterprise: {
    starter: resolveTierPriceId('enterprise', 'starter'),
    growth: resolveTierPriceId('enterprise', 'growth'),
    pro: resolveTierPriceId('enterprise', 'pro'),
    scale: resolveTierPriceId('enterprise', 'scale'),
  },
};

/** Returns the Paddle price ID for a package slug + customer tier, or null if unknown. */
export function getPaddlePriceId(
  slug: string,
  tier: CustomerTier = 'personal',
): string | null {
  const plan = planKeyFromSlug(slug);
  if (plan) {
    const fromTier = PADDLE_PRICE_IDS_BY_TIER[tier][plan]?.trim();
    if (fromTier) return fromTier;
  }

  // Legacy Personal-only fallback (aliases for Scale)
  const key = slug.trim().toLowerCase();
  if (
    tier === 'personal' &&
    (key === 'scale-business-bundle' ||
      key === 'scale' ||
      key === 'scale-consultation' ||
      key === 'advanced-consultation' ||
      key === 'elite-launch-package')
  ) {
    return SCALE_BUSINESS_BUNDLE_PRICE_ID;
  }

  if (tier === 'personal') {
    return PADDLE_PRICE_IDS[key] ?? null;
  }

  return null;
}

/** Resolve price ID from plan key + tier (used by pricing selector). */
export function getPaddlePriceIdForPlan(
  plan: PlanKey,
  tier: CustomerTier,
): string | null {
  return getPaddlePriceId(PLAN_SLUG_BY_KEY[plan], tier);
}
