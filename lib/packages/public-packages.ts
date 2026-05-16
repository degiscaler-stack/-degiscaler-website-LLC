import type { Package as DbPackage } from '@prisma/client';
import { safeFindPackageBySlug, safeFindPackages } from '@/lib/db/public-safe';
import {
  canonicalPackageSlug,
  publicPackageSlug,
  translationIdToSlug,
} from '@/lib/packages/map-slug';

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

export type FallbackPkg = {
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
  if (slug === 'scale-business-bundle') return 'premium';
  if (isPopular) return 'featured';
  return 'standard';
}

function fromDbRow(p: DbPackage): DisplayPackage {
  return {
    slug: publicPackageSlug(p.slug),
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
    variant:
      translationIdToSlug(p.id) === 'scale-business-bundle'
        ? 'premium'
        : p.id === 'pro'
          ? 'featured'
          : 'standard',
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

/** Map slug → translated fallback row (pricing messages). */
function fallbackBySlug(fallbacks: FallbackPkg[]): Map<string, FallbackPkg> {
  const m = new Map<string, FallbackPkg>();
  for (const fb of fallbacks) {
    try {
      m.set(translationIdToSlug(fb.id), fb);
    } catch {
      /* skip malformed id */
    }
  }
  return m;
}

/**
 * When packages come from the DB they are often English-only. Overlay titles, prices,
 * descriptions, and features from locale message fallbacks matched by slug so AR/FR stay consistent.
 * Missing fallback keeps DB values; empty fallback fields never wipe DB content.
 */
export function applyTranslatedPackageCopy(display: DisplayPackage[], fallbacks: FallbackPkg[]): DisplayPackage[] {
  if (!fallbacks.length) return display;
  const bySlug = fallbackBySlug(fallbacks);
  return display.map((pkg) => {
    const fb = bySlug.get(pkg.slug);
    if (!fb) return pkg;
    return {
      ...pkg,
      title: fb.name?.trim() ? fb.name : pkg.title,
      price: fb.price?.trim() ? fb.price : pkg.price,
      description: fb.description?.trim() ? fb.description : pkg.description,
      features:
        Array.isArray(fb.features) && fb.features.length > 0 ? fb.features.map(String) : pkg.features,
    };
  });
}

function overlayResolvedFromFallback<
  T extends {
    packageSlug: string;
    packageTitle: string;
    packagePrice: string;
    description: string;
    features: string[];
  },
>(resolved: T, fallbackPackages: FallbackPkg[]): T {
  const dbSlug = canonicalPackageSlug(resolved.packageSlug);
  const fb = fallbackPackages.find(
    (p) => canonicalPackageSlug(translationIdToSlug(p.id)) === dbSlug,
  );
  if (!fb) return resolved;
  return {
    ...resolved,
    packageTitle: fb.name?.trim() ? fb.name : resolved.packageTitle,
    packagePrice: fb.price?.trim() ? fb.price : resolved.packagePrice,
    description: fb.description?.trim() ? fb.description : resolved.description,
    features:
      Array.isArray(fb.features) && fb.features.length > 0 ? fb.features.map(String) : resolved.features,
  };
}

/** Prefer active packages from DB; on failure or empty, use translated fallback list. Never throws. */
export async function loadDisplayPackages(fallbackPackages: FallbackPkg[]): Promise<DisplayPackage[]> {
  const fb = fallbackResults(fallbackPackages);

  try {
    const rows = await safeFindPackages();
    if (rows.length > 0) {
      try {
        return rows.map(fromDbRow);
      } catch (mapErr) {
        console.error('[loadDisplayPackages]', mapErr);
        return fb;
      }
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
    const canonical = canonicalPackageSlug(trimmed);

    const row = await safeFindPackageBySlug(canonical);
    if (row) {
      const overlaid = overlayResolvedFromFallback(
        {
          packageId: row.id,
          packageSlug: row.slug,
          packageTitle: row.title,
          packagePrice: row.price,
          currency: row.currency,
          description: row.description,
          features: parseFeaturesJson(row.features),
        },
        fallbackPackages,
      );
      return {
        ...overlaid,
        packageSlug: publicPackageSlug(row.slug),
      };
    }

    const fb = fallbackPackages.find(
      (p) => canonicalPackageSlug(translationIdToSlug(p.id)) === canonical,
    );
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
