'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

const categoryKeys = ['services', 'process', 'pricing', 'legal'] as const;

export default function FaqPage() {
  const t = useTranslations('faqPage');
  const items: FaqItem[] = t.raw('items') as FaqItem[];
  const [activeCategory, setActiveCategory] = useState<string>('services');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = items.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-24">
      {/* Header */}
      <div
        className="py-16 lg:py-20"
        style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h1>
          <p className="text-base lg:text-lg" style={{ color: '#71717a' }}>
            {t('subheadline')}
          </p>
        </div>
      </div>

      <div className="py-16 lg:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={
                  activeCategory === cat
                    ? {
                        backgroundColor: '#FF8411',
                        color: '#ffffff',
                      }
                    : {
                        backgroundColor: '#0d0d0d',
                        color: '#71717a',
                        border: '1px solid #1a1a1a',
                      }
                }
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-2">
            {filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: isOpen
                      ? '1px solid rgba(255,132,17,0.2)'
                      : '1px solid #1a1a1a',
                    backgroundColor: '#0d0d0d',
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
        </div>
      </div>
    </div>
  );
}
