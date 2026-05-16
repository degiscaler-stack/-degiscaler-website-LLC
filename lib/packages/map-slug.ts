/**
 * Marketing-facing package slugs are persisted as `Package.slug` in the database.
 * Legacy bookmarked slugs still resolve for checkout continuity.
 */

const ORDERABLE_SLUGS = new Set([
  'starter-website-kit',
  'growth-optimization-kit',
  'pro-conversion-toolkit',
  'scale-business-bundle',
]);

/** Old bookmarked / checkout slugs → canonical slug */
const LEGACY_PACKAGE_SLUG_ALIASES: Record<string, string> = {
  'starter-consultation': 'starter-website-kit',
  'growth-consultation': 'growth-optimization-kit',
  'pro-consultation': 'pro-conversion-toolkit',
  'scale-consultation': 'scale-business-bundle',
  'advanced-consultation': 'scale-business-bundle',
  'elite-launch-package': 'scale-business-bundle',
};

/** Maps translation JSON `id` to public package slug used in URLs and UI. */
export function translationIdToSlug(id: string): string {
  const map: Record<string, string> = {
    starter: 'starter-website-kit',
    growth: 'growth-optimization-kit',
    pro: 'pro-conversion-toolkit',
    scale: 'scale-business-bundle',
    advanced: 'scale-business-bundle',
    elite: 'scale-business-bundle',
  };
  return map[id] ?? id;
}

/** Normalize any incoming slug (public or legacy) → canonical persisted slug. */
export function canonicalPackageSlug(slug: string): string {
  const key = slug.trim().toLowerCase();
  return LEGACY_PACKAGE_SLUG_ALIASES[key] ?? key;
}

/** Public slug used in URLs / order summaries (same as DB slug; legacy DB rows map forward). */
export function publicPackageSlug(dbSlug: string): string {
  return canonicalPackageSlug(dbSlug);
}

export function isOrderablePackageSlug(slug: string): boolean {
  return ORDERABLE_SLUGS.has(canonicalPackageSlug(slug));
}

export function canonicalPublicSlug(slug: string): string {
  return canonicalPackageSlug(slug);
}

/** Canonical package slug → shipped digital product filename under /public/downloads/. */
const PACKAGE_PRODUCT_ZIP: Record<string, string> = {
  'starter-website-kit': 'Starter_Website_Kit.zip',
  'growth-optimization-kit': 'Growth_Optimization_Kit.zip',
  'pro-conversion-toolkit': 'Pro_Conversion_Toolkit.zip',
  'scale-business-bundle': 'Scale_Business_Bundle.zip',
};

/** Filename under /public/downloads/ for the purchased kit (canonical slug). */
export function productZipFilename(publicSlug: string): string | null {
  const canon = canonicalPackageSlug(publicSlug);
  if (!ORDERABLE_SLUGS.has(canon)) return null;
  return PACKAGE_PRODUCT_ZIP[canon] ?? null;
}
