import { useTranslations } from 'next-intl';
import { contentMax, ds, sectionPad, sectionIntroBottom, sectionTitleClass, accentEyebrowClass, accentStatClass, cardSurfaceBgImage, cardTopHighlight, iconWellGlyphClass } from './homeTheme';

export default function ProcessSection() {
  const t = useTranslations('home.process');
  const steps: { number: string; title: string; description: string }[] =
    t.raw('steps') as { number: string; title: string; description: string }[];

  return (
    <section
      className={`${sectionPad} relative`}
      style={{
        backgroundColor: ds.bgAlt,
        borderTop: `1px solid ${ds.borderStrong}`,
      }}
    >
      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className={`max-w-[46rem] mx-auto text-center ${sectionIntroBottom}`}>
          <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
            {t('sectionLabel')}
          </span>
          <h2 className={sectionTitleClass} style={{ color: ds.text }}>
            {t('headline')}
          </h2>
        </div>

        <div className="relative">
          {/* Desktop timeline spine */}
          <div
            className="pointer-events-none absolute z-0 hidden xl:block inset-x-[8%] top-[62px]"
            aria-hidden
          >
            <div
              className="h-[1px] rounded-full w-full opacity-95"
              style={{
                background:
                  'linear-gradient(90deg, transparent 6%, rgba(255,132,17,0.12) 18%, rgba(232,204,101,0.14) 50%, rgba(255,132,17,0.12) 82%, transparent 94%)',
              }}
            />
            <div className="flex justify-between mt-[-5px] px-[5%]">
              {steps.map((s) => (
                <div
                  key={s.number}
                  className="size-2.5 rounded-full border shrink-0"
                  style={{
                    borderColor: ds.warmIconBorder,
                    backgroundColor: '#121110',
                    boxShadow: `0 0 0 3px ${ds.bgAlt}, inset 0 0 0 1px rgba(255,132,17,0.15)`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
            {steps.map((step) => (
              <div key={step.number} className="group">
                <div
                  className="rounded-2xl md:rounded-[1.4rem] h-full flex flex-col transition-colors duration-200 xl:pt-[4.75rem]"
                  style={{
                    backgroundImage: cardSurfaceBgImage,
                    backgroundColor: ds.cardElevated,
                    border: `1px solid ${ds.borderStrong}`,
                    padding: 'clamp(1.85rem, 4.5vw, 2.5rem)',
                    boxShadow: `${cardTopHighlight}, 0 18px 46px rgba(0,0,0,0.32)`,
                  }}
                >
                  <div className={`${iconWellGlyphClass} mb-8 inline-flex size-[56px] shrink-0 items-center justify-center rounded-xl border-0`}>
                    <span className={`text-[1.2rem] font-bold tabular-nums tracking-tight ${accentStatClass}`}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-[1.1rem] md:text-[1.15rem] font-bold mb-4 tracking-tight leading-snug" style={{ color: ds.text }}>
                    {step.title}
                  </h3>
                  <p className="text-[15.5px] leading-[1.72] flex-1" style={{ color: ds.textMuted }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
