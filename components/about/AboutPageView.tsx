import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Building2, Target, ClipboardList, BadgeCheck, ArrowRight } from 'lucide-react';
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

type TrustCard = { title: string; description: string };

const trustIcons = [Building2, Target, ClipboardList, BadgeCheck];

export default async function AboutPageView() {
  const t = await getTranslations('aboutPage');
  const trustItems = t.raw('trustItems') as TrustCard[];

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
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax} max-w-[52rem] mx-auto space-y-14 md:space-y-[4.5rem]`}>
          <div className="text-center">
            <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
              {t('missionLabel')}
            </span>
            <p className="text-[15.5px] md:text-[1.05rem] leading-[1.75]" style={{ color: ds.textSecondary }}>
              {t('missionText')}
            </p>
          </div>

          <div
            className="rounded-2xl md:rounded-[1.4rem] p-8 md:p-10"
            style={{
              border: `1px solid ${ds.borderStrong}`,
              backgroundImage: cardSurfaceBgImage,
              backgroundColor: ds.card,
              boxShadow: `${cardTopHighlight}, 0 16px 42px rgba(0,0,0,0.32)`,
            }}
          >
            <span className={`block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
              {t('whoWeHelpLabel')}
            </span>
            <p className="text-[15px] md:text-[1.02rem] leading-[1.72]" style={{ color: ds.textMuted }}>
              {t('whoWeHelpText')}
            </p>
          </div>

          <div
            className="rounded-2xl md:rounded-[1.4rem] p-8 md:p-10"
            style={{
              border: `1px solid ${ds.borderStrong}`,
              backgroundImage: cardSurfaceBgImage,
              backgroundColor: ds.card,
              boxShadow: `${cardTopHighlight}, 0 16px 42px rgba(0,0,0,0.32)`,
            }}
          >
            <span className={`block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
              {t('howWeWorkLabel')}
            </span>
            <p className="text-[15px] md:text-[1.02rem] leading-[1.72] mb-6" style={{ color: ds.textMuted }}>
              {t('howWeWorkIntro')}
            </p>
            <ul className="space-y-4">
              {(t.raw('howWeWorkBullets') as string[]).map((line) => (
                <li key={line} className="flex items-start gap-3 text-start">
                  <span className={`${accentDotMicroClass} mt-2 shrink-0`} aria-hidden />
                  <span className="text-[15px] leading-[1.7]" style={{ color: ds.textSecondary }}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-center mb-10 md:mb-12">
              <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
                {t('trustLabel')}
              </span>
              <p className="text-[15px] md:text-[1.02rem] leading-[1.72] max-w-[40rem] mx-auto" style={{ color: ds.textMuted }}>
                {t('trustIntro')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {trustItems.map((item, i) => {
                const Icon = trustIcons[i] ?? Building2;
                return (
                  <div
                    key={`${item.title}-${i}`}
                    className="rounded-2xl md:rounded-[1.35rem] p-6 md:p-7 flex gap-5"
                    style={{
                      border: `1px solid ${ds.borderStrong}`,
                      backgroundImage: cardSurfaceBgImage,
                      backgroundColor: ds.cardElevated,
                      boxShadow: `${cardTopHighlight}, 0 14px 36px rgba(0,0,0,0.28)`,
                    }}
                  >
                    <div className={`${iconWellGlyphClass} flex size-14 shrink-0 items-center justify-center rounded-xl`}>
                      <Icon size={24} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[1.05rem] font-bold mb-2 tracking-tight" style={{ color: ds.text }}>
                        {item.title}
                      </h2>
                      <p className="text-[14.5px] md:text-[15px] leading-[1.72]" style={{ color: ds.textMuted }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-2xl md:rounded-[1.35rem] p-7 md:p-8"
            style={{
              border: `1px solid ${ds.border}`,
              backgroundImage: cardSurfaceBgImage,
              backgroundColor: ds.bgDeep,
            }}
          >
            <h3
              className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: ds.textMuted }}
            >
              {t('companyDetails.label')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {(['name', 'type', 'focus', 'email'] as const).map((key) => (
                <div key={key}>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: ds.textMuted }}>
                    {t(`companyDetails.${key}Label`)}
                  </span>
                  <span className="text-[14.5px] md:text-[15px]" style={{ color: ds.textSecondary }}>
                    {t(`companyDetails.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-14 md:py-20 border-t"
        style={{ borderColor: ds.borderStrong, backgroundColor: ds.bgDeep }}
      >
        <div className={`${contentMax} px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center`}>
          <Link
            href="/pricing"
            className={`${primaryBtnClass} inline-flex justify-center items-center gap-2 px-10 py-3.5 rounded-xl text-[15px] font-semibold rtl:flex-row-reverse`}
          >
            {t('pricingCta')}
            <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
          </Link>
          <Link
            href="/contact"
            className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
          >
            {t('contactCta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
