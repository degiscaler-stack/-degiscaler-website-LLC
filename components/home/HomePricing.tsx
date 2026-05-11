import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, ArrowRight, Star } from 'lucide-react';
import type { DisplayPackage } from '@/lib/packages/public-packages';
import { isOrderableConsultationSlug } from '@/lib/packages/map-slug';
import {


  ds,
  sectionPad,
  sectionIntroBottom,
  sectionTitleClass,
  accentEyebrowClass,
  priceFeaturedClass,
  primaryBtnClass,
  cardSurfaceBgImage,
  iconWellSmGlyphClass,
  iconPricingWellClass,
  pricingCardSecondaryBtnClass,
  pricingCardDividerClass,
} from './homeTheme';

const PRICING_ICON_COLOR = '#e8cc65';

const iconWrapClass = `${iconWellSmGlyphClass} ${iconPricingWellClass} mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-0`;

function packageCtaHref(slug: string): string {
  return isOrderableConsultationSlug(slug)
    ? `/order?package=${encodeURIComponent(slug)}`
    : '/contact';
}

export default function HomePricing({ packages }: { packages: DisplayPackage[] }) {
  const sectionT = useTranslations('home.pricing');

  return (
    <section
      className={sectionPad}
      style={{
        backgroundColor: ds.bgMain,
        backgroundImage:
          'linear-gradient(180deg, rgba(255,132,17,0.02) 0%, transparent 36%), linear-gradient(90deg, rgba(255,132,17,0.015) 0%, transparent 30%, transparent 70%, rgba(232,204,101,0.012) 100%)',
      }}
    >
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1380px] xl:max-w-[1440px] mx-auto">
        <div className={`max-w-[46rem] mx-auto text-center ${sectionIntroBottom}`}>
          <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
            {sectionT('sectionLabel')}
          </span>
          <h2 className={`${sectionTitleClass} mb-6 md:mb-7`} style={{ color: ds.text }}>
            {sectionT('headline')}
          </h2>
          <p className="text-[1.05rem] md:text-[1.0825rem] leading-[1.72] mx-auto max-w-[40rem]" style={{ color: ds.textMuted }}>
            {sectionT('subheadline')}
          </p>
          <p
            className="mt-5 md:mt-6 mx-auto max-w-[38rem] text-[14.5px] md:text-[15px] leading-[1.7] font-medium"
            style={{ color: ds.textSecondary }}
          >
            {sectionT('valueFraming')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 xl:gap-8 items-stretch">
          {packages.map((pkg) => {
            const featuredVisual = pkg.variant !== 'standard';
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
                key={pkg.slug}
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
                        <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] ${accentEyebrowClass}`}>
                          {sectionT('mostPopular')}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <p className="font-semibold text-[1.05rem] md:text-[1.125rem] mb-3 tracking-tight" style={{ color: ds.text }}>
                    {pkg.title}
                  </p>
                  <div className="flex items-baseline gap-1 flex-wrap gap-y-1">
                    {featuredVisual ? (
                      <span className={`text-[2.5rem] md:text-[2.75rem] font-bold tracking-tight tabular-nums leading-none ${priceFeaturedClass}`}>
                        {pkg.price}
                      </span>
                    ) : (
                      <span
                        className="text-[2.5rem] md:text-[2.75rem] font-bold tracking-tight tabular-nums leading-none text-[#F5F2E9]"
                        style={{ textShadow: '0 0 36px rgba(232,204,101,0.08)' }}
                      >
                        {pkg.price}
                      </span>
                    )}
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

                  <Link
                    href={packageCtaHref(pkg.slug)}
                    className={`${
                      featuredVisual ? primaryBtnClass : pricingCardSecondaryBtnClass
                    } block w-full text-center py-4 rounded-xl text-[15px] font-semibold mt-auto`}
                  >
                    {sectionT('getStarted')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 md:mt-14 lg:mt-16">
          <Link href="/pricing" className={`${primaryBtnClass} group inline-flex items-center gap-3 px-12 md:px-14 py-4 md:py-[1.2rem] rounded-xl text-[16px] font-semibold`}>
            {sectionT('viewAll')}
            <ArrowRight size={20} className="rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
