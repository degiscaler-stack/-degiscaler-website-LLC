import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Layout,
  ShoppingCart,
  Zap,
  Search,
  Eye,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import {
  contentMax,
  ds,
  sectionPad,
  sectionIntroBottom,
  sectionTitleClass,
  accentEyebrowClass,
  accentDotMicroClass,
  primaryBtnClass,
  iconWellGlyphClass,
  cardSurfaceBgImage,
  cardTopHighlight,
} from './homeTheme';

const serviceIcons = {
  websiteDesign: Layout,
  ecommerce: ShoppingCart,
  landingPage: Zap,
  audit: Search,
  uiux: Eye,
  growthPlanning: MessageSquare,
};

const primaryKeys = ['websiteDesign', 'ecommerce', 'landingPage'] as const;
const secondaryKeys = ['audit', 'uiux', 'growthPlanning'] as const;

export default function ServicesSection() {
  const t = useTranslations('home.services');

  const renderCard = (key: (typeof primaryKeys)[number] | (typeof secondaryKeys)[number], isPrimary: boolean) => {
    const Icon = serviceIcons[key];
    return (
      <div
        key={key}
        className="group rounded-2xl md:rounded-[1.4rem] flex flex-col gap-7 md:gap-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(0,0,0,0.38)]"
        style={{
          backgroundImage: isPrimary
            ? `linear-gradient(135deg, rgba(255,132,17,0.05) 0%, transparent 26%, transparent 74%, rgba(232,204,101,0.04) 100%), ${cardSurfaceBgImage}`
            : cardSurfaceBgImage,
          backgroundColor: isPrimary ? ds.cardElevated : ds.card,
          border: isPrimary ? `1px solid ${ds.warmIconBorder}` : `1px solid ${ds.borderStrong}`,
          padding: 'clamp(1.85rem, 5vw, 2.6rem)',
          boxShadow: isPrimary
            ? `${cardTopHighlight}, 0 16px 42px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,132,17,0.06), inset -1px 0 0 rgba(232,204,101,0.05)`
            : `${cardTopHighlight}, 0 16px 40px rgba(0,0,0,0.32)`,
        }}
      >
        <div
          className={`${iconWellGlyphClass} flex h-14 w-14 items-center justify-center rounded-xl shrink-0 md:h-[56px] md:w-[56px]`}
        >
          <Icon
            size={27}
            strokeWidth={1.85}
            className="transition-transform duration-200 group-hover:scale-[1.03]"
            style={{ color: ds.iconGold }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[1.125rem] md:text-[1.2rem] font-bold mb-3.5 tracking-tight leading-snug" style={{ color: ds.text }}>
            {t(`items.${key}.title`)}
          </h3>
          <p className="text-[15px] md:text-[1.02rem] leading-[1.72]" style={{ color: ds.textMuted }}>
            {t(`items.${key}.description`)}
          </p>
        </div>

          <div className="flex items-start gap-3.5 pt-7 md:pt-8" style={{ borderTop: `1px solid ${ds.border}` }}>
          <span className={`${accentDotMicroClass} mt-2 shrink-0`} aria-hidden />
          <p className="text-[14.5px] md:text-[15px] font-semibold leading-relaxed" style={{ color: ds.textSecondary }}>
            {t(`items.${key}.outcome`)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      className={`${sectionPad} relative`}
      style={{
        backgroundColor: ds.bgAlt,
        borderTop: `1px solid ${ds.borderStrong}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-55"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,132,17,0.16), rgba(232,204,101,0.14), transparent)',
        }}
        aria-hidden
      />

      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className={`max-w-[46rem] mx-auto text-center ${sectionIntroBottom}`}>
          <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
            {t('sectionLabel')}
          </span>
          <h2 className={`${sectionTitleClass} mb-6 md:mb-7`} style={{ color: ds.text }}>
            {t('headline')}
          </h2>
          <p className="text-[1.05rem] md:text-[1.0825rem] leading-[1.72] mx-auto max-w-[38rem]" style={{ color: ds.textMuted }}>
            {t('subheadline')}
          </p>
        </div>

        <p className={`text-center text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] mb-7 md:mb-9 ${accentEyebrowClass}`}>
          {t('coreServicesLabel')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-9 xl:gap-10 mb-10 md:mb-12">
          {primaryKeys.map((key) => renderCard(key, true))}
        </div>

        <p
          className="text-center text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] mb-7 md:mb-9"
          style={{ color: ds.textMuted }}
        >
          {t('additionalServicesLabel')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-11">
          {secondaryKeys.map((key) => renderCard(key, false))}
        </div>

        <div className="text-center mt-12 md:mt-14 lg:mt-16">
          <Link
            href="/services"
            className={`${primaryBtnClass} group inline-flex items-center gap-2.5 px-11 py-[1.15rem] md:px-12 md:py-5 rounded-xl text-[15.5px] font-semibold`}
          >
            {t('viewAll')}
            <ArrowRight size={19} aria-hidden className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
