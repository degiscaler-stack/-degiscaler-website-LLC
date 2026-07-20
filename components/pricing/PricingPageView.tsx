import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import PricingJsonLd from '@/components/pricing/PricingJsonLd';
import PricingCardsSection from '@/components/pricing/PricingCardsSection';
import type { DisplayPackage } from '@/lib/packages/public-packages';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  accentEyebrowClass,
  accentDotMicroClass,
  primaryBtnClass,
  cardSurfaceBgImage,
  secondaryBtnClass,
} from '@/components/home/homeTheme';

export default async function PricingPageView({
  packages,
}: {
  packages: DisplayPackage[];
}) {
  const t = await getTranslations('pricingPage');
  const included: string[] = (t.raw('includedItems') as string[]) ?? [];
  const howSteps: { title: string; detail: string }[] =
    (t.raw('howSteps') as { title: string; detail: string }[]) ?? [];
  const cardComplianceLines = (t.raw('cardComplianceLines') as string[]) ?? [];

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <PricingJsonLd packages={packages} />
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
        <div className="px-4 sm:px-6 lg:px-10 max-w-[1380px] xl:max-w-[1440px] mx-auto">
          <PricingCardsSection
            packages={packages}
            showPerPackage
            labels={{
              mostPopular: t('mostPopular'),
              continueToCheckout: t('continueToCheckout'),
              perPackage: t('perPackage'),
              tierSelectorLabel: t('tierSelectorLabel'),
              cardComplianceLines,
            }}
          />

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
        className={`${sectionPad} border-t`}
        style={{
          borderColor: ds.borderStrong,
          backgroundColor: ds.bgAlt,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax} max-w-[46rem] mx-auto text-center`}>
          <h2 className={`text-lg md:text-xl font-bold mb-3 ${accentEyebrowClass}`}>{t('trustCheckoutTitle')}</h2>
          <p className="text-[15px] md:text-[1.02rem] leading-[1.75]" style={{ color: ds.textSecondary }}>
            {t('trustCheckoutBody')}
          </p>
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
