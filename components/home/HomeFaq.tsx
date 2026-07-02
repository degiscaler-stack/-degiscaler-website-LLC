'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import {
  ds,
  sectionPad,
  contentMax,
  sectionIntroBottom,
  accentEyebrowClass,
  cardSurfaceBgImage,
  cardTopHighlight,
  iconWellGlyphClass,
} from './homeTheme';

type FaqItem = { question: string; answer: string };

export default function HomeFaq() {
  const t = useTranslations('home.faq');
  const items: FaqItem[] = t.raw('items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className={`${sectionPad} relative`}
      style={{
        backgroundColor: ds.bgAlt,
        borderTop: `1px solid ${ds.borderStrong}`,
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent 45%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
        aria-hidden
      />

      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className="max-w-[52rem] mx-auto">
          <div className={`text-center ${sectionIntroBottom}`}>
            <span className={`inline-block text-[12px] font-bold uppercase tracking-[0.18em] mb-4 ${accentEyebrowClass}`}>
              {t('sectionLabel')}
            </span>
            <h2
              className="text-[1.75rem] sm:text-[2.15rem] md:text-[2.6rem] xl:text-[2.85rem] font-bold tracking-tight leading-[1.1]"
              style={{ color: ds.text }}
            >
              {t('headline')}
            </h2>
          </div>

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
                    boxShadow: isOpen ? `${cardTopHighlight}, inset 0 1px 0 rgba(255,255,255,0.05)` : `${cardTopHighlight}, 0 10px 32px rgba(0,0,0,0.22)`,
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
                    <div className={`${iconWellGlyphClass} flex size-[52px] shrink-0 items-center justify-center rounded-xl border-0 md:size-14`}>
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
                      <p className="text-[15.5px] md:text-[1.05rem] leading-[1.75] max-w-[46rem]" style={{ color: ds.textSecondary }}>
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10 md:mt-14">
            <Link
              href="/faq"
              className={`inline-flex items-center gap-2 text-[15.5px] md:text-[16px] font-semibold transition-opacity hover:opacity-[0.82] rtl:flex-row-reverse ${accentEyebrowClass}`}
            >
              {t('viewAll')}
              <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
