import {
  isConfiguredPaddlePriceId,
  premiumBundlePriceIds,
  type PremiumBundlePriceIdKey,
} from '@/lib/paddle/config';

export type PremiumBundleId = 'digital-edge' | 'momentum-suite' | 'apex-collection';

export type PremiumBundleDefinition = {
  id: PremiumBundleId;
  name: string;
  amount: number;
  currency: 'EUR';
  priceLabel: string;
  schemaPrice: string;
  billing: string;
  description: string;
  features: readonly string[];
  cta: string;
  featured: boolean;
  badge?: string;
  priceIdKey: PremiumBundlePriceIdKey;
};

export const PREMIUM_BUNDLES: readonly PremiumBundleDefinition[] = [
  {
    id: 'digital-edge',
    name: 'Digital Edge',
    amount: 339,
    currency: 'EUR',
    priceLabel: '€339',
    schemaPrice: '339',
    billing: 'One-time purchase',
    description:
      'A focused collection of practical digital resources for building and improving your online business.',
    features: [
      'Website Optimization Resource Pack',
      'Conversion Improvement Checklists',
      'Business Planning Templates',
      'Landing Page Review Resources',
      'Trust & Credibility Checklists',
      'Downloadable PDF Guides',
      'Implementation Worksheets',
      'Digital Resource Updates',
      'Instant Digital Access',
    ],
    cta: 'Get Digital Edge',
    featured: false,
    priceIdKey: 'digitalEdgePriceId',
  },
  {
    id: 'momentum-suite',
    name: 'Momentum Suite',
    amount: 559,
    currency: 'EUR',
    priceLabel: '€559',
    schemaPrice: '559',
    billing: 'One-time purchase',
    description:
      'An expanded resource suite for businesses that need deeper optimization, planning, and conversion materials.',
    features: [
      'Everything in Digital Edge',
      'Advanced Website Optimization Resources',
      'Conversion & Checkout Templates',
      'Growth Planning Worksheets',
      'Customer Journey Checklists',
      'Business Audit Templates',
      'Advanced Implementation Guides',
      'Extended Template Collection',
      'Premium Downloadable Resources',
      'Future Resource Updates',
      'Priority Digital Access',
    ],
    cta: 'Get Momentum Suite',
    featured: true,
    badge: 'MOST POPULAR',
    priceIdKey: 'momentumSuitePriceId',
  },
  {
    id: 'apex-collection',
    name: 'Apex Collection',
    amount: 1549,
    currency: 'EUR',
    priceLabel: '€1,549',
    schemaPrice: '1549',
    billing: 'One-time purchase',
    description:
      'The most comprehensive DigiScaler digital resource collection for advanced businesses requiring the broadest library of materials.',
    features: [
      'Everything in Momentum Suite',
      'Complete Premium Resource Library',
      'Advanced Optimization Kits',
      'Full Business Template Collection',
      'Advanced Conversion Resources',
      'Extended Audit & Planning Documents',
      'Premium Workflow Resources',
      'Complete Checklist Collection',
      'Advanced PDF & Worksheet Library',
      'Access to Future Premium Resources',
      'Priority Resource Updates',
    ],
    cta: 'Get Apex Collection',
    featured: false,
    priceIdKey: 'apexCollectionPriceId',
  },
] as const;

export function getPremiumBundleBySlug(
  slug: string,
): PremiumBundleDefinition | undefined {
  const key = slug.trim().toLowerCase();
  return PREMIUM_BUNDLES.find((bundle) => bundle.id === key);
}

export function getPremiumBundlePriceId(bundle: PremiumBundleDefinition): string {
  return premiumBundlePriceIds[bundle.priceIdKey];
}

export function getLivePremiumBundlePriceId(
  bundle: PremiumBundleDefinition,
): string | undefined {
  const id = getPremiumBundlePriceId(bundle);
  return isConfiguredPaddlePriceId(id) ? id.trim() : undefined;
}

export function getLivePremiumBundlePriceIdBySlug(slug: string): string | undefined {
  const bundle = getPremiumBundleBySlug(slug);
  if (!bundle) return undefined;
  return getLivePremiumBundlePriceId(bundle);
}
