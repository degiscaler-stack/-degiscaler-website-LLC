import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  Layout,
  ShoppingCart,
  Zap,
  Search,
  Eye,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  accentEyebrowClass,
  accentDotMicroClass,
  primaryBtnClass,
  secondaryBtnClass,
  iconWellGlyphClass,
  cardSurfaceBgImage,
  cardTopHighlight,
} from '@/components/home/homeTheme';

const serviceIcons = {
  websiteDesign: Layout,
  ecommerce: ShoppingCart,
  landingPage: Zap,
  audit: Search,
  uiux: Eye,
  growthPlanning: MessageSquare,
} as const;

const primaryKeys = ['websiteDesign', 'ecommerce', 'landingPage'] as const;
const secondaryKeys = ['audit', 'uiux', 'growthPlanning'] as const;

type ServiceEntry = {
  title: string;
  description: string;
  outcome: string;
  note: string;
};

export default async function ServicesPageView() {
  const t = await getTranslations('servicesPage');

  const renderCard = (
    key: (typeof primaryKeys)[number] | (typeof secondaryKeys)[number],
    isPrimary: boolean
  ) => {
    const Icon = serviceIcons[key];
    const item = t.raw(`services.${key}`) as ServiceEntry;
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
          <h2 className="text-[1.125rem] md:text-[1.2rem] font-bold mb-3.5 tracking-tight leading-snug" style={{ color: ds.text }}>
            {item.title}
          </h2>
          <p className="text-[15px] md:text-[1.02rem] leading-[1.72]" style={{ color: ds.textMuted }}>
            {item.description}
          </p>
        </div>

        <div className="flex items-start gap-3.5 pt-7 md:pt-8" style={{ borderTop: `1px solid ${ds.border}` }}>
          <span className={`${accentDotMicroClass} mt-2 shrink-0`} aria-hidden />
          <p className="text-[14.5px] md:text-[15px] font-semibold leading-relaxed" style={{ color: ds.textSecondary }}>
            {item.outcome}
          </p>
        </div>

        <p className="text-[13px] md:text-[13.5px] leading-[1.65] italic" style={{ color: ds.textMuted }}>
          {item.note}
        </p>
      </div>
    );
  };

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero eyebrow={t('eyebrow')} title={t('headline')} subtitle={t('subheadline')} />
      </section>

      <section
        className={sectionPad}
        style={{
          backgroundColor: ds.bgAlt,
          borderTop: `1px solid ${ds.borderStrong}`,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <p
            className={`text-center text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] mb-8 md:mb-10 ${accentEyebrowClass}`}
          >
            {t('gridLabel')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-9 xl:gap-10 mb-12 md:mb-14">
            {primaryKeys.map((key) => renderCard(key, true))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-11">
            {secondaryKeys.map((key) => renderCard(key, false))}
          </div>

          <div className="max-w-[46rem] mx-auto text-center mt-14 md:mt-16 mb-4 md:mb-6">
            <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
              {t('includedTitle')}
            </span>
          </div>
          <ul className="max-w-[40rem] mx-auto space-y-4 mb-4">
            {((t.raw('includedItems') as string[]) ?? []).map((line) => (
              <li key={line} className="flex items-start gap-3 text-start">
                <span className={`${accentDotMicroClass} mt-2 shrink-0`} aria-hidden />
                <span className="text-[15px] leading-[1.7]" style={{ color: ds.textSecondary }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className={`${sectionPad} border-t`}
        style={{ borderColor: ds.borderStrong, backgroundColor: ds.bgMain }}
      >
        <div
          className={`${contentMax} px-4 sm:px-6 lg:px-10 max-w-[48rem] mx-auto rounded-2xl md:rounded-[1.75rem] p-8 md:p-12 text-center`}
          style={{
            border: `1px solid ${ds.border}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.cardElevated,
            boxShadow: `${cardTopHighlight}, 0 24px 64px rgba(0,0,0,0.45)`,
          }}
        >
          <h2 className="text-[1.25rem] md:text-[1.45rem] font-bold mb-4 tracking-tight" style={{ color: ds.text }}>
            {t('processCtaHeadline')}
          </h2>
          <p className="text-[15px] md:text-[1.02rem] leading-[1.72] mb-8" style={{ color: ds.textMuted }}>
            {t('processCtaSub')}
          </p>
          <Link
            href="/pricing"
            className={`${primaryBtnClass} inline-flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
          >
            {t('processCtaButton')}
            <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </section>

      <section
        className="py-14 md:py-20 border-t"
        style={{ borderColor: ds.borderStrong, backgroundColor: ds.bgDeep }}
      >
        <div className={`${contentMax} px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center`}>
          <Link
            href="/pricing"
            className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
          >
            {t('finalCtaPrimary')}
          </Link>
          <Link
            href="/contact"
            className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
          >
            {t('finalCtaSecondary')}
          </Link>
        </div>
      </section>
    </div>
  );
}
