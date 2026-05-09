import { useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  contentMax,
  ds,
  sectionPad,
  sectionIntroBottom,
  sectionTitleClass,
  accentEyebrowClass,
  accentDotMicroClass,
  iconWellGlyphClass,
  iconWellSmGlyphClass,
  cardSurfaceBgImage,
  cardTopHighlight,
} from './homeTheme';

export default function ProblemSolution() {
  const t = useTranslations('home.problemSolution');
  const problems: string[] = t.raw('problems') as string[];
  const solutions: string[] = t.raw('solutions') as string[];

  return (
    <section
      className={`${sectionPad} relative`}
      style={{
        backgroundColor: ds.bgMain,
        borderTop: `1px solid ${ds.borderStrong}`,
        backgroundImage:
          'linear-gradient(180deg, rgba(255,132,17,0.02) 0%, transparent 42%), linear-gradient(90deg, rgba(232,204,101,0.015) 0%, transparent 38%, transparent 62%, rgba(255,132,17,0.02) 100%)',
      }}
    >
      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className={`max-w-[46rem] mx-auto text-center ${sectionIntroBottom}`}>
          <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>{t('problemLabel')}</span>
          <h2 className={`${sectionTitleClass} mb-6 md:mb-8`} style={{ color: ds.text }}>
            {t('headline')}
          </h2>
          <p className="text-[1.05rem] md:text-[1.125rem] leading-[1.72] max-w-[40rem] mx-auto" style={{ color: ds.textMuted }}>
            {t('subheadline')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-11 xl:gap-14 items-stretch">
          {/* Calm warning — amber/stone, not aggressive red */}
          <div
            className="rounded-2xl md:rounded-[1.4rem] relative overflow-hidden"
            style={{
              backgroundImage: cardSurfaceBgImage,
              backgroundColor: ds.card,
              border: `1px solid ${ds.borderStrong}`,
              boxShadow: `${cardTopHighlight}, 0 18px 48px rgba(0,0,0,0.28)`,
              padding: 'clamp(1.85rem, 5vw, 2.65rem)',
            }}
          >
            <div
              className="absolute start-0 top-0 bottom-0 w-[3px] rounded-s-2xl"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,132,17,0.45) 0%, rgba(214,167,0,0.35) 50%, rgba(232,204,101,0.22) 100%)',
              }}
              aria-hidden
            />
            <div className="flex items-center gap-5 mb-10 ps-1">
              <div className={`${iconWellGlyphClass} flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-0 md:h-[56px] md:w-[56px]`}>
                <AlertTriangle className="w-[26px] h-[26px]" strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
              </div>
              <span className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: ds.textMuted }}>
                {t('problemLabel')}
              </span>
            </div>
            <ul className="space-y-7 ps-1">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className={`${accentDotMicroClass} mt-2.5 shrink-0`} aria-hidden />
                  <span className="text-[15.5px] md:text-[1.02rem] leading-[1.7]" style={{ color: ds.textSecondary }}>
                    {problem}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl md:rounded-[1.4rem]"
            style={{
              backgroundImage:
                `linear-gradient(90deg, rgba(255,132,17,0.07) 0%, transparent 26%, transparent 74%, rgba(232,204,101,0.06) 100%), ${cardSurfaceBgImage}`,
              backgroundColor: ds.cardElevated,
              border: `1px solid ${ds.warmIconBorder}`,
              boxShadow: `${cardTopHighlight}, 0 24px 56px rgba(0,0,0,0.42)`,
              padding: 'clamp(1.85rem, 5vw, 2.65rem)',
            }}
          >
            <div className="flex items-center gap-5 mb-8 ps-1">
              <div className={`${iconWellGlyphClass} flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-0 md:h-[56px] md:w-[56px]`}>
                <CheckCircle2 className="w-[26px] h-[26px]" strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
              </div>
              <span className={`text-[12px] font-bold uppercase tracking-[0.14em] ${accentEyebrowClass}`}>{t('solutionLabel')}</span>
            </div>
            <p className="text-[1.15rem] md:text-[1.25rem] font-semibold mb-9 leading-snug tracking-tight" style={{ color: ds.text }}>
              {t('solutionHeadline')}
            </p>
            <ul className="space-y-7">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className={`${iconWellSmGlyphClass} mt-1 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-0`}>
                    <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={2} style={{ color: ds.iconGold }} aria-hidden />
                  </span>
                  <span className="text-[15.5px] md:text-[1.02rem] leading-[1.7]" style={{ color: ds.textSecondary }}>
                    {solution}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
