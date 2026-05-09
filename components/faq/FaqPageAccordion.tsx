'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';
import {
  ds,
  sectionPad,
  contentMax,
  pageMainTopClass,
  accentEyebrowClass,
  cardSurfaceBgImage,
  cardTopHighlight,
  iconWellGlyphClass,
} from '@/components/home/homeTheme';
import PageHero from '@/components/layout/PageHero';

type FaqItem = { question: string; answer: string };

export default function FaqPageAccordion() {
  const t = useTranslations('faqPage');
  const items = t.raw('items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent 45%)',
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <div className="max-w-[52rem] mx-auto">
            <p className="text-center text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] mb-10 md:mb-12">
              <span className={accentEyebrowClass}>{t('listIntro')}</span>
            </p>

            <div className="space-y-4 md:space-y-5">
              {items.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl md:rounded-[1.4rem] overflow-hidden transition-all duration-200 hover:border-[rgba(232,204,101,0.14)]"
                    style={{
                      border: isOpen ? `1px solid ${ds.warmIconBorder}` : `1px solid ${ds.borderStrong}`,
                      backgroundImage: isOpen
                        ? `linear-gradient(90deg, rgba(255,132,17,0.05) 0%, transparent 22%, transparent 78%, rgba(232,204,101,0.04) 100%), ${cardSurfaceBgImage}`
                        : `linear-gradient(182deg, rgba(255,255,255,0.02) 0%, transparent 55%), ${cardSurfaceBgImage}`,
                      backgroundColor: isOpen ? ds.cardElevated : ds.card,
                      boxShadow: isOpen
                        ? `${cardTopHighlight}, inset 0 1px 0 rgba(255,255,255,0.05)`
                        : `${cardTopHighlight}, 0 10px 32px rgba(0,0,0,0.22)`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-6 px-7 md:px-10 py-6 md:py-7 text-start"
                      aria-expanded={isOpen}
                    >
                      <span
                        className="text-[15.5px] md:text-[1.08rem] font-semibold leading-snug pe-6"
                        style={{ color: isOpen ? ds.text : ds.textSecondary }}
                      >
                        {item.question}
                      </span>
                      <div
                        className={`${iconWellGlyphClass} flex size-[52px] shrink-0 items-center justify-center rounded-xl border-0 md:size-14`}
                      >
                        {isOpen ? (
                          <Minus size={22} strokeWidth={2} style={{ color: ds.iconGold }} aria-hidden />
                        ) : (
                          <Plus size={22} strokeWidth={2} style={{ color: ds.iconGold }} aria-hidden />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-7 md:px-10 pb-8 md:pb-10 pt-0">
                        <div className="h-px mb-6" style={{ backgroundColor: ds.border }} />
                        <p
                          className="text-[15.5px] md:text-[1.05rem] leading-[1.75] max-w-[46rem]"
                          style={{ color: ds.textSecondary }}
                        >
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
