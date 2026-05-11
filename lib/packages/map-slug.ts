/** Maps translation JSON `id` to persisted package slug. */
export function translationIdToSlug(id: string): string {
  const map: Record<string, string> = {
    starter: 'starter-consultation',
    growth: 'growth-consultation',
    pro: 'pro-consultation',
    scale: 'scale-consultation',
    /** Legacy ids in old content → canonical slugs used on the live site */
    advanced: 'scale-consultation',
    elite: 'scale-consultation',
  };
  return map[id] ?? id;
}

const ORDERABLE_CANONICAL = new Set([
  'starter-consultation',
  'growth-consultation',
  'pro-consultation',
  'scale-consultation',
]);

/** Old bookmarked/checkout slugs resolve to the closest current package. */
const LEGACY_PACKAGE_SLUG_ALIASES: Record<string, string> = {
  'advanced-consultation': 'scale-consultation',
  'elite-launch-package': 'scale-consultation',
};

export function canonicalConsultationSlug(slug: string): string {
  const key = slug.trim().toLowerCase();
  return LEGACY_PACKAGE_SLUG_ALIASES[key] ?? key;
}

export function isOrderableConsultationSlug(slug: string): boolean {
  return ORDERABLE_CANONICAL.has(canonicalConsultationSlug(slug));
}
