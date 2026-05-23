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

/** Canonical package slug → Paddle Billing price ID (production) */
export const PADDLE_PRICE_IDS: Record<string, string> = {
  'starter-website-kit':     'pri_01krxpqy3yhpm8yhaq6n19x2h5',
  'growth-optimization-kit': 'pri_01krxppkpm5wsd53fat02vn9h9',
  'pro-conversion-toolkit':  'pri_01krxpmw00ssf3xfmf88c71sf5',
  'scale-business-bundle':   'pri_01krxphdej0qp3c741vj94ms96',
};

/** Returns the Paddle price ID for a given package slug, or null if unknown. */
export function getPaddlePriceId(slug: string): string | null {
  return PADDLE_PRICE_IDS[slug] ?? null;
}

/**
 * Maps next-intl locale codes to Paddle-supported locales.
 * Arabic is not supported by Paddle Billing checkout; falls back to English.
 */
export function toPaddleLocale(locale: string): string {
  const map: Record<string, string> = { en: 'en', fr: 'fr', ar: 'en' };
  return map[locale] ?? 'en';
}
