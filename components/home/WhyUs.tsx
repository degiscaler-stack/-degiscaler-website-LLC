import { useTranslations } from 'next-intl';
import { Building2, Package, CreditCard, Users, Tag, ShieldOff } from 'lucide-react';
import { contentMax, ds, sectionPad, sectionIntroBottom, sectionTitleClass, accentEyebrowClass, cardSurfaceBgImage, cardTopHighlight, iconWellGlyphClass } from './homeTheme';

const icons = [Building2, Package, CreditCard, Users, Tag, ShieldOff];
const nums = ['01', '02', '03', '04', '05', '06'];

export default function WhyUs() {
  const t = useTranslations('home.whyUs');
  const items: { title: string; description: string }[] = t.raw('items') as {
    title: string;
    description: string;
  }[];

  return (
    <section className={`${sectionPad} relative overflow-hidden border-t`} style={{ backgroundColor: ds.bgDeep, borderColor: ds.border }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background: 'linear-gradient(180deg, transparent 58%, rgba(5,5,5,0.65) 100%)',
        }}
        aria-hidden
      />

      <div className={`relative px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className={`max-w-[46rem] mx-auto text-center ${sectionIntroBottom}`}>
          <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
            {t('sectionLabel')}
          </span>
          <h2 className={sectionTitleClass} style={{ color: ds.text }}>
            {t('headline')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-11">
          {items.map((item, i) => {
            const Icon = icons[i] ?? Building2;
            return (
              <div
                key={i}
                className="rounded-2xl md:rounded-[1.4rem] flex flex-col gap-6 md:gap-7 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(0,0,0,0.4)]"
                style={{
                  backgroundImage: cardSurfaceBgImage,
                  backgroundColor: ds.card,
                  border: `1px solid ${ds.borderStrong}`,
                  padding: 'clamp(1.75rem, 4.5vw, 2.45rem)',
                  boxShadow: `${cardTopHighlight}, 0 16px 42px rgba(0,0,0,0.3)`,
                }}
              >
                <span
                  className="pointer-events-none select-none absolute -end-1 top-1 text-[4.75rem] md:text-[5.25rem] font-semibold tabular-nums tracking-tighter leading-none"
                  style={{ color: 'rgba(245,242,233,0.04)' }}
                  aria-hidden
                >
                  {nums[i]}
                </span>

                <div className="flex items-start justify-between gap-4 relative z-[1]">
                  <div className={`${iconWellGlyphClass} flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-0 md:h-[56px] md:w-[56px]`}>
                    <Icon size={27} strokeWidth={1.85} style={{ color: ds.iconGold }} />
                  </div>
                </div>

                <div className="relative z-[1] space-y-3.5 pt-1">
                  <h3 className="text-[1.065rem] md:text-[1.15rem] font-bold leading-snug tracking-tight" style={{ color: ds.text }}>
                    {item.title}
                  </h3>
                  <p className="text-[15px] md:text-[1.02rem] leading-[1.72]" style={{ color: ds.textMuted }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
