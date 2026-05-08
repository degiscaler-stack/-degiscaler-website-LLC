'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronDown, ArrowRight } from 'lucide-react';

type FaqItem = { question: string; answer: string };

export default function HomeFaq() {
  const t = useTranslations('home.faq');
  const items: FaqItem[] = t.raw('items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-20 lg:py-28"
      style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#FF8411' }}
          >
            {t('sectionLabel')}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  border: isOpen
                    ? '1px solid rgba(255,132,17,0.2)'
                    : '1px solid #1a1a1a',
                  backgroundColor: '#111111',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-sm font-medium leading-snug"
                    style={{ color: '#f5f5f5' }}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      color: '#FF8411',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div
                      className="h-px mb-4"
                      style={{ backgroundColor: '#1a1a1a' }}
                    />
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#a1a1aa' }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: '#FF8411' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = '#f5f5f5')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = '#FF8411')
            }
          >
            {t('viewAll')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
