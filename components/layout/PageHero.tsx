import type { ReactNode } from 'react';
import {
  contentMax,
  ds,
  accentEyebrowClass,
  sectionTitleClass,
} from '@/components/home/homeTheme';

type PageHeroProps = {
  eyebrow?: ReactNode;
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <div className={`${contentMax} px-4 sm:px-6 lg:px-10 py-12 md:py-14 lg:py-16`}>
      <div className="max-w-[52rem] mx-auto text-center">
        {eyebrow ? (
          <div className={`text-[12px] font-bold tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
            {eyebrow}
          </div>
        ) : null}
        <h1 className={`${sectionTitleClass} mb-5 md:mb-6 text-balance`} style={{ color: ds.text }}>
          {title}
        </h1>
        <p
          className="text-[1.05rem] md:text-[1.1rem] leading-[1.72] max-w-[40rem] mx-auto text-pretty"
          style={{ color: ds.textMuted }}
        >
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}
