import type { ReactNode } from 'react';
import {
  ds,
  pageMainTopClass,
  accentEyebrowClass,
  cardSurfaceBgImage,
  cardTopHighlight,
  contentMax,
  sectionPad,
} from '@/components/home/homeTheme';

type Section = { title: string; content: string };

interface LegalPageProps {
  eyebrow?: string;
  headline: string;
  lastUpdated: string;
  intro?: string;
  sections: Section[];
  disclaimer?: string;
  contactNote?: ReactNode;
}

export default function LegalPage({
  eyebrow,
  headline,
  lastUpdated,
  intro,
  sections,
  disclaimer,
  contactNote,
}: LegalPageProps) {
  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <div className={`${contentMax} px-4 sm:px-6 lg:px-10 py-12 md:py-14 lg:py-16`}>
          <div className="max-w-[52rem] mx-auto text-start md:text-center">
            {eyebrow ? (
              <p className={`text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>{eyebrow}</p>
            ) : null}
            <p className="text-[13px] font-medium mb-3" style={{ color: ds.textMuted }}>
              {lastUpdated}
            </p>
            <h1
              className="text-[1.75rem] sm:text-[2.15rem] md:text-[2.5rem] font-bold tracking-tight leading-[1.12] text-balance"
              style={{ color: ds.text }}
            >
              {headline}
            </h1>
          </div>
        </div>
      </section>

      <section
        className={sectionPad}
        style={{
          backgroundColor: ds.bgAlt,
          borderTop: `1px solid ${ds.borderStrong}`,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax} max-w-[44rem] mx-auto`}>
          {intro ? (
            <p className="text-[15px] md:text-[1.02rem] leading-[1.75] mb-12 md:mb-14 text-pretty" style={{ color: ds.textMuted }}>
              {intro}
            </p>
          ) : null}

          <div className="space-y-10 md:space-y-12">
            {sections.map((section, i) => (
              <div
                key={i}
                className="rounded-2xl md:rounded-[1.35rem] p-7 md:p-9"
                style={{
                  border: `1px solid ${ds.borderStrong}`,
                  backgroundImage: cardSurfaceBgImage,
                  backgroundColor: ds.card,
                  boxShadow: `${cardTopHighlight}, 0 14px 40px rgba(0,0,0,0.3)`,
                }}
              >
                <h2 className="text-[1.05rem] md:text-[1.15rem] font-bold mb-4 tracking-tight" style={{ color: ds.text }}>
                  {section.title}
                </h2>
                <p className="text-[14.5px] md:text-[15px] leading-[1.75] whitespace-pre-line" style={{ color: ds.textSecondary }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {disclaimer ? (
            <p className="mt-12 md:mt-14 text-[13px] md:text-[14px] leading-[1.72] italic text-pretty px-2" style={{ color: ds.textMuted }}>
              {disclaimer}
            </p>
          ) : null}

          <div
            className="mt-12 md:mt-14 rounded-2xl p-7 md:p-8"
            style={{
              border: `1px solid ${ds.border}`,
              backgroundImage: cardSurfaceBgImage,
              backgroundColor: ds.bgDeep,
            }}
          >
            {contactNote ?? (
              <p className="text-[14.5px] leading-relaxed">
                <a href="mailto:support@degiscaler.com" className="font-semibold underline-offset-2 hover:opacity-90" style={{ color: ds.iconGold }}>
                  support@degiscaler.com
                </a>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
