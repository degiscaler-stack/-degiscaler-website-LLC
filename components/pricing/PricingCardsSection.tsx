'use client';

import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import type { DisplayPackage } from '@/lib/packages/public-packages';
import { isOrderablePackageSlug } from '@/lib/packages/map-slug';
import { getPaddlePriceId } from '@/lib/paddle/config';
import {
  DEFAULT_CUSTOMER_TIER,
  displayPriceFor,
  type CustomerTier,
} from '@/lib/pricing/customer-tiers';
import PackageCardFooter from '@/components/pricing/PackageCardFooter';
import PricingTierSelector from '@/components/pricing/PricingTierSelector';
import {
  ds,
  accentEyebrowClass,
  priceFeaturedClass,
  cardSurfaceBgImage,
  iconWellSmGlyphClass,
  iconPricingWellClass,
  pricingCardDividerClass,
} from '@/components/home/homeTheme';

const PRICING_ICON_COLOR = '#e8cc65';
const iconWrapClass = `${iconWellSmGlyphClass} ${iconPricingWellClass} mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-0`;

function packageCtaHref(slug: string): string {
  return isOrderablePackageSlug(slug)
    ? `/order?package=${encodeURIComponent(slug)}`
    : '/contact';
}

type Labels = {
  mostPopular: string;
  continueToCheckout: string;
  perPackage?: string;
  tierSelectorLabel?: string;
  cardComplianceLines: string[];
};

type Props = {
  packages: DisplayPackage[];
  labels: Labels;
  /** Show “/ per package” under the price (pricing page) */
  showPerPackage?: boolean;
};

function PricingTierCard({
  pkg,
  tier,
  labels,
  showPerPackage,
}: {
  pkg: DisplayPackage;
  tier: CustomerTier;
  labels: Labels;
  showPerPackage?: boolean;
}) {
  const featuredVisual = pkg.variant !== 'standard';
  const price = displayPriceFor(tier, pkg.slug) ?? pkg.price;
  const priceId = getPaddlePriceId(pkg.slug, tier) ?? undefined;

  const rimGradient =
    pkg.variant === 'premium' || pkg.variant === 'featured'
      ? ds.featuredRimGradient
      : ds.pricingTierRimGradient;
  const surfaceClass =
    pkg.variant === 'premium' || pkg.variant === 'featured'
      ? 'pricing-card-surface pricing-card-surface--featured'
      : 'pricing-card-surface pricing-card-surface--standard';
  const headerBoost =
    pkg.variant === 'premium' ? 0.078 : pkg.variant === 'featured' ? 0.072 : 0.058;
  const showBadgeRow = pkg.variant === 'featured';

  return (
    <div
      className={`rounded-2xl md:rounded-[1.4rem] flex flex-col overflow-hidden h-full ${surfaceClass}`}
      style={{
        backgroundImage: `${cardSurfaceBgImage}, ${rimGradient}`,
        backgroundOrigin: 'padding-box, border-box',
        backgroundClip: 'padding-box, border-box',
        border: '1px solid transparent',
        backgroundColor: '#111214',
      }}
    >
      <div
        className="px-6 md:px-8 pt-6 md:pt-7 pb-6 md:pb-7 border-b"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          backgroundImage: [
            `linear-gradient(90deg, rgba(255,132,17,${headerBoost}) 0%, transparent 44%)`,
            `linear-gradient(270deg, rgba(232,204,101,${pkg.variant === 'premium' ? 0.06 : pkg.variant === 'featured' ? 0.056 : 0.044}) 0%, transparent 42%)`,
            'linear-gradient(180deg, #15161A 0%, rgba(17,18,20,0.94) 100%)',
          ].join(', '),
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {showBadgeRow ? (
          <div className="mb-3 flex min-h-0 items-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                border: '1px solid rgba(232,204,101,0.24)',
                backgroundColor: 'rgba(232,204,101,0.05)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.045)',
              }}
            >
              <span
                className={`${iconWellSmGlyphClass} ${iconPricingWellClass} inline-flex size-[30px] shrink-0 items-center justify-center rounded-lg border-0`}
              >
                <Star size={15} strokeWidth={2} style={{ color: PRICING_ICON_COLOR }} aria-hidden />
              </span>
              <span
                className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] ${accentEyebrowClass}`}
              >
                {labels.mostPopular}
              </span>
            </div>
          </div>
        ) : null}

        <p
          className="font-semibold text-[1.05rem] md:text-[1.125rem] mb-3 tracking-tight"
          style={{ color: ds.text }}
        >
          {pkg.title}
        </p>
        <div className="flex flex-wrap items-baseline gap-1 gap-y-1">
          <span
            key={`${tier}-${pkg.slug}-price`}
            className={`pricing-card-price text-[2.5rem] md:text-[2.75rem] font-bold tracking-tight tabular-nums leading-none ${
              featuredVisual ? priceFeaturedClass : 'text-[#F5F2E9]'
            }`}
            style={
              featuredVisual ? undefined : { textShadow: '0 0 36px rgba(232,204,101,0.08)' }
            }
          >
            {price}
          </span>
          {showPerPackage && labels.perPackage ? (
            <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: ds.textMuted }}>
              / {labels.perPackage}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0">
        <p className="text-[15.5px] mb-6 leading-[1.65]" style={{ color: ds.textMuted }}>
          {pkg.description}
        </p>

        <div className={`mb-6 ${pricingCardDividerClass}`} role="separator" />

        <ul className="space-y-[0.95rem] flex-1 mb-8" role="list">
          {pkg.features.map((feat) => (
            <li key={feat} className="flex items-start gap-3.5">
              <div className={iconWrapClass}>
                <Check size={16} strokeWidth={2.25} style={{ color: PRICING_ICON_COLOR }} aria-hidden />
              </div>
              <span className="text-[15px] leading-[1.65]" style={{ color: ds.textSecondary }}>
                {feat}
              </span>
            </li>
          ))}
        </ul>

        <PackageCardFooter
          key={`${tier}-${pkg.slug}-${priceId ?? 'link'}`}
          checkoutHref={packageCtaHref(pkg.slug)}
          checkoutLabel={labels.continueToCheckout}
          complianceLines={labels.cardComplianceLines}
          featuredVisual={featuredVisual}
          priceId={priceId}
        />
      </div>
    </div>
  );
}

/**
 * Interactive pricing grid: tier tabs update all four cards instantly (no reload).
 */
export default function PricingCardsSection({
  packages,
  labels,
  showPerPackage = false,
}: Props) {
  const [tier, setTier] = useState<CustomerTier>(DEFAULT_CUSTOMER_TIER);

  return (
    <div>
      <PricingTierSelector
        value={tier}
        onChange={setTier}
        label={labels.tierSelectorLabel}
      />

      <div
        id="pricing-cards-panel"
        role="tabpanel"
        aria-labelledby={`pricing-tier-${tier}`}
        key={tier}
        className="pricing-cards-tier-panel grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 xl:gap-8 items-stretch"
      >
        {packages.map((pkg) => (
          <PricingTierCard
            key={pkg.slug}
            pkg={pkg}
            tier={tier}
            labels={labels}
            showPerPackage={showPerPackage}
          />
        ))}
      </div>
    </div>
  );
}
