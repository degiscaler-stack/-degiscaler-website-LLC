/** Maps translation JSON `id` to persisted package slug. */
export function translationIdToSlug(id: string): string {
  const map: Record<string, string> = {
    starter: 'starter-consultation',
    growth: 'growth-consultation',
    pro: 'pro-consultation',
    advanced: 'advanced-consultation',
    elite: 'elite-launch-package',
  };
  return map[id] ?? id;
}

export function isOrderableConsultationSlug(slug: string): boolean {
  return (
    slug === 'starter-consultation' ||
    slug === 'growth-consultation' ||
    slug === 'pro-consultation'
  );
}
