/**
 * Paddle Billing (v2) — production configuration.
 *
 * The token below is the live client-side token (safe to ship in client bundles).
 * Override it via NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in .env.local or your host panel.
 */

// Public client-side token — NOT a secret. Using a literal fallback ensures
// checkout works on every deployment without extra environment setup.
export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
  'live_161611987544b1027904accc5ad';

/** Canonical package slug → Paddle Billing EUR price ID (production) */
export const PADDLE_PRICE_IDS: Record<string, string> = {
  'starter-website-kit':     'pri_01krxpqy3yhpm8yhaq6n19x2h5',
  'growth-optimization-kit': 'pri_01krxppkpm5wsd53fat02vn9h9',
  'pro-conversion-toolkit':  'pri_01krxpmw00ssf3xfmf88c71sf5',
  'scale-business-bundle':   'pri_01krxphdej0gp3c741vj94ms96',
};

const SCALE_BUSINESS_BUNDLE_PRICE_ID = 'pri_01krxphdej0gp3c741vj94ms96';

/** Returns the Paddle price ID for a given package slug, or null if unknown. */
export function getPaddlePriceId(slug: string): string | null {
  const key = slug.trim().toLowerCase();

  if (
    key === 'scale-business-bundle' ||
    key === 'scale' ||
    key === 'scale-consultation' ||
    key === 'advanced-consultation' ||
    key === 'elite-launch-package'
  ) {
    return SCALE_BUSINESS_BUNDLE_PRICE_ID;
  }

  return PADDLE_PRICE_IDS[key] ?? null;
}
