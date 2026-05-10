import type { Package as DbPackage } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { translationIdToSlug } from '@/lib/packages/map-slug';

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

/** Prefer active packages from DB; on failure or empty, use translated fallback list. */
export async function loadDisplayPackages(fallbackPackages: FallbackPkg[]): Promise<DisplayPackage[]> {
  try {
    const rows = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
    if (rows.length > 0) {
      return rows.map(fromDbRow);
    }
  } catch {
    // DB unavailable — fallback below
  }
  return fallbackPackages.map(fromFallback);
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
  const trimmed = slug?.trim();
  if (!trimmed) return null;

  try {
    const row = await prisma.package.findFirst({
      where: { slug: trimmed, isActive: true },
    });
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
  } catch {
    // fall through to fallback
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
}
