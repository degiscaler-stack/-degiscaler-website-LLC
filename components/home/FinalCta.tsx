import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { contentMax, ds, sectionPad, sectionTitleClass, primaryBtnStrongClass, secondaryBtnClass, cardSurfaceBgImage, cardTopHighlight } from './homeTheme';

export default function FinalCta() {
  const t = useTranslations('home.cta');

  return (
    <section
      className={`${sectionPad} relative`}
      style={{
        backgroundColor: ds.bgMain,
        borderTop: `1px solid ${ds.borderStrong}`,
        backgroundImage:
          'linear-gradient(180deg, rgba(232,204,101,0.015) 0%, transparent 40%), linear-gradient(90deg, rgba(255,132,17,0.02) 0%, transparent 35%, transparent 65%, rgba(232,204,101,0.02) 100%)',
      }}
    >
      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div
          className="rounded-2xl md:rounded-[1.75rem] px-8 py-14 md:px-16 md:py-16 lg:px-20 lg:py-[4.5rem] text-center relative overflow-hidden border"
          style={{
            borderColor: ds.border,
            backgroundImage: [
              'linear-gradient(90deg, rgba(255,132,17,0.07) 0%, transparent 18%, transparent 82%, rgba(232,204,101,0.055) 100%)',
              'linear-gradient(180deg, rgba(232,204,101,0.03) 0%, transparent 45%)',
              cardSurfaceBgImage,
            ].join(', '),
            backgroundColor: ds.cardElevated,
            boxShadow: `${cardTopHighlight}, 0 36px 88px rgba(0,0,0,0.52)`,
          }}
        >
          <div className="relative max-w-[48rem] mx-auto z-[1]">
            <div
              className="w-20 h-[3px] rounded-full mx-auto mb-10 md:mb-12"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,132,17,0.45), rgba(232,204,101,0.5), transparent)',
              }}
            />

            <h2 className={`${sectionTitleClass} mb-7 md:mb-8`} style={{ color: ds.text }}>
              {t('headline')}
            </h2>
            <p
              className="text-[1.05rem] md:text-[1.125rem] mb-11 md:mb-12 leading-[1.72] max-w-[40rem] mx-auto"
              style={{ color: ds.textMuted }}
            >
              {t('subheadline')}
            </p>

            <div className="relative flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-4 md:gap-5 w-full max-w-md sm:max-w-none mx-auto">
              <div className="relative flex w-full justify-center sm:w-auto">
                <div
                  className="final-cta-primary-glow absolute left-1/2 top-1/2 z-0 h-[140px] w-[min(380px,92vw)] -translate-x-1/2 -translate-y-[42%] opacity-90"
                  aria-hidden
                />
                <Link
                  href="/pricing"
                  className={`${primaryBtnStrongClass} group relative z-[2] inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-12 py-4 text-[16px] font-semibold md:px-14 md:py-[1.15rem] sm:w-auto`}
                >
                  {t('ctaPrimary')}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" size={20} aria-hidden />
                </Link>
              </div>
              <Link
                href="/contact"
                className={`${secondaryBtnClass} relative z-[2] inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-12 py-4 text-[16px] font-semibold md:px-14 md:py-[1.15rem] sm:w-auto`}
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
