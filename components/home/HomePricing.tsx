'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { DisplayPackage } from '@/lib/packages/public-packages';
import PricingCardsSection from '@/components/pricing/PricingCardsSection';
import {
  ds,
  sectionPad,
  sectionIntroBottom,
  sectionTitleClass,
  accentEyebrowClass,
  primaryBtnClass,
} from './homeTheme';

export default function HomePricing({ packages }: { packages: DisplayPackage[] }) {
  const sectionT = useTranslations('home.pricing');
  const cardUi = useTranslations('pricingPage');
  const cardComplianceLines = (cardUi.raw('cardComplianceLines') as string[]) ?? [];

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

        <PricingCardsSection
          packages={packages}
          labels={{
            mostPopular: sectionT('mostPopular'),
            continueToCheckout: cardUi('continueToCheckout'),
            tierSelectorLabel: cardUi('tierSelectorLabel'),
            cardComplianceLines,
          }}
        />

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
