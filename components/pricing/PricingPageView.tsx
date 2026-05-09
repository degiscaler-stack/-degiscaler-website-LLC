import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Check, ArrowRight, Star } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  accentEyebrowClass,
  accentDotMicroClass,
  priceFeaturedClass,
  primaryBtnClass,
  cardSurfaceBgImage,
  iconWellSmGlyphClass,
  iconPricingWellClass,
  pricingCardSecondaryBtnClass,
  pricingCardDividerClass,
  secondaryBtnClass,
} from '@/components/home/homeTheme';

type Package = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
};

const PRICING_ICON_COLOR = '#e8cc65';
const iconWrapClass = `${iconWellSmGlyphClass} ${iconPricingWellClass} mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-0`;

function PricingTierCard({
  pkg,
  t,
}: {
  pkg: Package;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const isPro = pkg.id === 'pro';
  const isElite = pkg.id === 'elite';
  const rimGradient =
    isPro || isElite ? ds.featuredRimGradient : ds.pricingTierRimGradient;
  const surfaceClass =
    isPro || isElite
      ? 'pricing-card-surface pricing-card-surface--featured'
      : 'pricing-card-surface pricing-card-surface--standard';
  const headerBoost = isElite ? 0.078 : isPro ? 0.072 : 0.058;

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
        className="px-8 md:px-10 pt-9 pb-8 border-b"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          backgroundImage: [
            `linear-gradient(90deg, rgba(255,132,17,${headerBoost}) 0%, transparent 44%)`,
            `linear-gradient(270deg, rgba(232,204,101,${isElite ? 0.06 : isPro ? 0.056 : 0.044}) 0%, transparent 42%)`,
            'linear-gradient(180deg, #15161A 0%, rgba(17,18,20,0.94) 100%)',
          ].join(', '),
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="mb-5 flex min-h-[42px] items-center">
          {isPro ? (
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
                {t('mostPopular')}
              </span>
            </div>
          ) : isElite ? (
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                border: '1px solid rgba(232,204,101,0.28)',
                backgroundColor: 'rgba(232,204,101,0.06)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <span
                className={`${iconWellSmGlyphClass} ${iconPricingWellClass} inline-flex size-[30px] shrink-0 items-center justify-center rounded-lg border-0`}
              >
                <Star size={15} strokeWidth={2} style={{ color: PRICING_ICON_COLOR }} aria-hidden />
              </span>
              <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] ${accentEyebrowClass}`}>
                {t('premiumBadge')}
              </span>
            </div>
          ) : null}
        </div>

        <p className="font-semibold text-[1.05rem] md:text-[1.125rem] mb-4 tracking-tight" style={{ color: ds.text }}>
          {pkg.name}
        </p>
        <div className="flex flex-wrap items-baseline gap-1 gap-y-1">
          <span
            className={`text-[2.5rem] md:text-[2.75rem] font-bold tracking-tight tabular-nums leading-none ${
              isPro || isElite ? priceFeaturedClass : 'text-[#F5F2E9]'
            }`}
            style={
              isPro || isElite ? undefined : { textShadow: '0 0 36px rgba(232,204,101,0.08)' }
            }
          >
            {pkg.price}
          </span>
          <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: ds.textMuted }}>
            / {t('perPackage')}
          </span>
        </div>
      </div>

      <div className="p-8 md:p-10 flex flex-col flex-1 min-h-0">
        <p className="text-[15.5px] mb-8 leading-[1.68] flex-1" style={{ color: ds.textMuted }}>
          {pkg.description}
        </p>

        <div className={`mb-8 ${pricingCardDividerClass}`} role="separator" />

        <ul className="space-y-[1.05rem] flex-1 mb-10" role="list">
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
          href="/contact"
          className={`${
            isPro || isElite ? primaryBtnClass : pricingCardSecondaryBtnClass
          } block w-full text-center py-4 rounded-xl text-[15px] font-semibold mt-auto`}
        >
          {t('getStarted')}
        </Link>
      </div>
    </div>
  );
}

export default async function PricingPageView() {
  const t = await getTranslations('pricingPage');
  const packages = t.raw('packages') as Package[];
  const included: string[] = (t.raw('includedItems') as string[]) ?? [];
  const howSteps: { title: string; detail: string }[] =
    (t.raw('howSteps') as { title: string; detail: string }[]) ?? [];

  const row1 = packages.slice(0, 3);
  const row2 = packages.slice(3);

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('headline')}
          subtitle={t('subheadline')}
        />
      </section>

      <section
        className={sectionPad}
        style={{
          backgroundColor: ds.bgMain,
          backgroundImage:
            'linear-gradient(180deg, rgba(255,132,17,0.02) 0%, transparent 36%), linear-gradient(90deg, rgba(255,132,17,0.015) 0%, transparent 30%, transparent 70%, rgba(232,204,101,0.012) 100%)',
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-9 items-stretch mb-10 lg:mb-14">
            {row1.map((pkg) => (
              <PricingTierCard key={pkg.id} pkg={pkg} t={t} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-9 max-w-[820px] mx-auto items-stretch">
            {row2.map((pkg) => (
              <PricingTierCard key={pkg.id} pkg={pkg} t={t} />
            ))}
          </div>

          <p
            className="text-[13px] md:text-[14px] text-center mt-10 md:mt-14 max-w-[46rem] mx-auto leading-relaxed"
            style={{ color: ds.textMuted }}
          >
            {t('disclaimer')}
          </p>
        </div>
      </section>

      <section
        className={`${sectionPad} border-t`}
        style={{
          borderColor: ds.borderStrong,
          backgroundColor: ds.bgAlt,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <div className="max-w-[46rem] mx-auto text-center mb-10 md:mb-14">
            <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
              {t('includedTitle')}
            </span>
          </div>
          <ul className="max-w-[40rem] mx-auto space-y-4 mb-16 md:mb-20">
            {included.map((line) => (
              <li key={line} className="flex items-start gap-3 text-start">
                <span className={`${accentDotMicroClass} mt-2 shrink-0`} aria-hidden />
                <span className="text-[15px] leading-[1.7]" style={{ color: ds.textSecondary }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-[1100px] mx-auto">
            {howSteps.map((step, idx) => (
              <div
                key={`${step.title}-${idx}`}
                className="rounded-2xl md:rounded-[1.4rem] p-6 md:p-7 flex flex-col gap-4"
                style={{
                  border: `1px solid ${ds.borderStrong}`,
                  backgroundImage: cardSurfaceBgImage,
                  backgroundColor: ds.card,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.056), 0 16px 42px rgba(0,0,0,0.32)`,
                }}
              >
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accentEyebrowClass}`}>
                  {t('stepLabel', { n: idx + 1 })}
                </span>
                <h3 className="text-[1.05rem] font-bold tracking-tight" style={{ color: ds.text }}>
                  {step.title}
                </h3>
                <p className="text-[15px] leading-[1.72] flex-1" style={{ color: ds.textMuted }}>
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${sectionPad} border-t`}
        style={{
          borderColor: ds.borderStrong,
          backgroundColor: ds.bgMain,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax} max-w-[46rem]`}>
          <div
            className="rounded-2xl md:rounded-[1.4rem] p-8 md:p-10"
            style={{
              border: `1px solid ${ds.warmIconBorder}`,
              backgroundImage: cardSurfaceBgImage,
              backgroundColor: ds.cardElevated,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.056), 0 20px 52px rgba(0,0,0,0.38)`,
            }}
          >
            <h2 className={`text-lg md:text-xl font-bold mb-4 ${accentEyebrowClass}`}>{t('paymentNoteTitle')}</h2>
            <p className="text-[15px] md:text-[1.02rem] leading-[1.75]" style={{ color: ds.textSecondary }}>
              {t('paymentNote')}
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-14 md:py-20 border-t"
        style={{ borderColor: ds.borderStrong, backgroundColor: ds.bgDeep }}
      >
        <div className={`${contentMax} px-4 sm:px-6 lg:px-10 text-center`}>
          <p className="text-[15.5px] md:text-[1.05rem] font-medium mb-2" style={{ color: ds.textSecondary }}>
            {t('faqPreviewText')}
          </p>
          <Link
            href="/faq"
            className={`inline-flex items-center gap-2 mb-12 text-[15px] font-semibold transition-opacity hover:opacity-[0.82] rtl:flex-row-reverse ${accentEyebrowClass}`}
          >
            {t('faqPreviewLink')}
            <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
          </Link>
          <p className="text-[1rem] md:text-[1.1rem] mb-8 max-w-lg mx-auto" style={{ color: ds.textMuted }}>
            {t('ctaHeadline')}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
            >
              {t('ctaButton')}
            </Link>
            <Link
              href="/services"
              className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
