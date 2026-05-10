import type { Package as DbPackage } from '@prisma/client';
import { translationIdToSlug } from '@/lib/packages/map-slug';
import { safeFindPackageBySlug } from '@/lib/db/public-safe';

export type DisplayPackage = {
  slug: string;
  title: string;
  subtitle: string | null;
  price: string;
  currency: string;
  description: string;
  features: string[];
  isPopular: boolean;
  /** Visual tier: matches existing pricing card variants */
  variant: 'standard' | 'featured' | 'premium';
};

type FallbackPkg = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
};

function parseFeaturesJson(features: DbPackage['features']): string[] {
  if (Array.isArray(features)) {
    return features.filter((x): x is string => typeof x === 'string');
  }
  return [];
}

function variantFor(slug: string, isPopular: boolean): DisplayPackage['variant'] {
  if (slug.includes('elite')) return 'premium';
  if (isPopular) return 'featured';
  return 'standard';
}

function fromDbRow(p: DbPackage): DisplayPackage {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? null,
    price: p.price,
    currency: p.currency,
    description: p.description,
    features: parseFeaturesJson(p.features),
    isPopular: p.isPopular,
    variant: variantFor(p.slug, p.isPopular),
  };
}

function fromFallback(p: FallbackPkg): DisplayPackage {
  const slug = translationIdToSlug(p.id);
  return {
    slug,
    title: p.name,
    subtitle: null,
    price: p.price,
    currency: 'USD',
    description: p.description,
    features: p.features,
    isPopular: p.id === 'pro',
    variant: p.id === 'elite' ? 'premium' : p.id === 'pro' ? 'featured' : 'standard',
  };
}

function fallbackResults(packages: FallbackPkg[]): DisplayPackage[] {
  try {
    return packages.map(fromFallback);
  } catch (err) {
    console.error('[loadDisplayPackages] fallback map failed', err);
    return [];
  }
}

/** Prefer active packages from DB; on failure or empty, use translated fallback list. Never throws. */
export async function loadDisplayPackages(fallbackPackages: FallbackPkg[]): Promise<DisplayPackage[]> {
  const fb = fallbackResults(fallbackPackages);

  try {
    let prismaMod: typeof import('@/lib/prisma');
    try {
      prismaMod = await import('@/lib/prisma');
    } catch (err) {
      console.error('[loadDisplayPackages]', err);
      return fb;
    }

    try {
      const rows = await prismaMod.prisma.package.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      });
      if (rows.length > 0) {
        try {
          return rows.map(fromDbRow);
        } catch (mapErr) {
          console.error('[loadDisplayPackages]', mapErr);
          return fb;
        }
      }
    } catch (err) {
      console.error('[loadDisplayPackages]', err);
    }
    return fb;
  } catch (outer) {
    console.error('[loadDisplayPackages]', outer);
    return fb;
  }
}

export async function resolvePackageForOrder(
  slug: string | undefined,
  fallbackPackages: FallbackPkg[],
): Promise<{
  packageId: string | null;
  packageSlug: string;
  packageTitle: string;
  packagePrice: string;
  currency: string;
  description: string;
  features: string[];
} | null> {
  try {
    const trimmed = slug?.trim();
    if (!trimmed) return null;

    const row = await safeFindPackageBySlug(trimmed);
    if (row) {
      return {
        packageId: row.id,
        packageSlug: row.slug,
        packageTitle: row.title,
        packagePrice: row.price,
        currency: row.currency,
        description: row.description,
        features: parseFeaturesJson(row.features),
      };
    }

    const fb = fallbackPackages.find((p) => translationIdToSlug(p.id) === trimmed);
    if (!fb) return null;
    const d = fromFallback(fb);
    return {
      packageId: null,
      packageSlug: d.slug,
      packageTitle: d.title,
      packagePrice: d.price,
      currency: d.currency,
      description: d.description,
      features: d.features,
    };
  } catch (err) {
    console.error('[resolvePackageForOrder]', err);
    return null;
  }
}
