'use client';

import { Check, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PremiumBundleCheckoutButton from '@/components/pricing/PremiumBundleCheckoutButton';
import {
  PREMIUM_BUNDLES,
  getLivePremiumBundlePriceId,
  type PremiumBundleDefinition,
} from '@/lib/pricing/premium-bundles';
import {
  ds,
  sectionPad,
  sectionIntroBottom,
  sectionTitleClass,
  accentEyebrowClass,
  priceFeaturedClass,
  cardSurfaceBgImage,
  iconWellSmGlyphClass,
  iconPricingWellClass,
  pricingCardDividerClass,
} from './homeTheme';

const PRICING_ICON_COLOR = '#e8cc65';
const iconWrapClass = `${iconWellSmGlyphClass} ${iconPricingWellClass} mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-0`;

function BundleCard({ bundle }: { bundle: PremiumBundleDefinition }) {
  const featuredVisual = bundle.featured;
  const priceId = getLivePremiumBundlePriceId(bundle) ?? '';
  const rimGradient = featuredVisual ? ds.featuredRimGradient : ds.pricingTierRimGradient;
  const surfaceClass = featuredVisual
    ? 'pricing-card-surface pricing-card-surface--featured'
    : 'pricing-card-surface pricing-card-surface--standard';
  const headerBoost = featuredVisual ? 0.072 : 0.058;

  return (
    <article
      id={bundle.id}
      className={`rounded-2xl md:rounded-[1.4rem] flex flex-col overflow-hidden h-full min-w-0 ${surfaceClass} ${
        featuredVisual ? 'lg:scale-[1.04] lg:z-[1] lg:-my-2' : ''
      }`}
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
            `linear-gradient(270deg, rgba(232,204,101,${featuredVisual ? 0.056 : 0.044}) 0%, transparent 42%)`,
            'linear-gradient(180deg, #15161A 0%, rgba(17,18,20,0.94) 100%)',
          ].join(', '),
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {bundle.badge ? (
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
                {bundle.badge}
              </span>
            </div>
          </div>
        ) : null}

        <p
          className="font-semibold text-[1.05rem] md:text-[1.125rem] mb-3 tracking-tight"
          style={{ color: ds.text }}
        >
          {bundle.name}
        </p>
        <div className="flex flex-wrap items-baseline gap-1 gap-y-1">
          <span
            className={`pricing-card-price text-[2.5rem] md:text-[2.75rem] font-bold tracking-tight tabular-nums leading-none ${
              featuredVisual ? priceFeaturedClass : 'text-[#F5F2E9]'
            }`}
            style={featuredVisual ? undefined : { textShadow: '0 0 36px rgba(232,204,101,0.08)' }}
          >
            {bundle.priceLabel}
          </span>
        </div>
        <p className="mt-3 text-[13px] font-medium" style={{ color: ds.textMuted }}>
          {bundle.billing}
        </p>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0">
        <p className="text-[15.5px] mb-6 leading-[1.65]" style={{ color: ds.textMuted }}>
          {bundle.description}
        </p>

        <div className={`mb-6 ${pricingCardDividerClass}`} role="separator" />

        <ul className="pricing-card-features space-y-[0.95rem] flex-1 mb-8" role="list">
          {bundle.features.map((feat) => (
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

        <div className="mt-auto">
          <PremiumBundleCheckoutButton
            priceId={priceId}
            label={bundle.cta}
            featuredVisual={featuredVisual}
          />
        </div>
      </div>
    </article>
  );
}

export default function PremiumBundlesSection() {
  const t = useTranslations('home.premiumBundles');

  return (
    <section
      id="premium-digital-bundles"
      className={`${sectionPad} overflow-x-hidden`}
      style={{
        backgroundColor: ds.bgAlt,
        backgroundImage:
          'linear-gradient(180deg, rgba(255,132,17,0.018) 0%, transparent 34%), linear-gradient(90deg, rgba(255,132,17,0.012) 0%, transparent 28%, transparent 72%, rgba(232,204,101,0.012) 100%)',
        borderTop: `1px solid ${ds.borderStrong}`,
      }}
    >
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1380px] xl:max-w-[1440px] mx-auto">
        <div className={`max-w-[46rem] mx-auto text-center ${sectionIntroBottom}`}>
          <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
            {t('eyebrow')}
          </span>
          <h2 className={`${sectionTitleClass} mb-6 md:mb-7`} style={{ color: ds.text }}>
            {t('headline')}
          </h2>
          <p className="text-[1.05rem] md:text-[1.0825rem] leading-[1.72] mx-auto max-w-[40rem]" style={{ color: ds.textMuted }}>
            {t('description')}
          </p>
          <p
            className="mt-5 md:mt-6 mx-auto max-w-[38rem] text-[14.5px] md:text-[15px] leading-[1.7] font-medium"
            style={{ color: ds.textSecondary }}
          >
            {t('trustLine')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 xl:gap-8 items-stretch">
          {PREMIUM_BUNDLES.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>
    </section>
  );
}
