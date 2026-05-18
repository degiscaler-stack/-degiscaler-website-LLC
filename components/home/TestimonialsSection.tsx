'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ds,
  sectionPad,
  contentMax,
  sectionIntroBottom,
  accentEyebrowClass,
  cardSurfaceBgImage,
  cardTopHighlight,
} from './homeTheme';

type Testimonial = {
  name: string;
  role: string;
  meta: string;
  rating: string;
  quote: string;
  avatar?: string;
};

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article
      className="testimonial-card-marquee flex w-[min(100%,300px)] sm:w-[320px] lg:w-[340px] shrink-0 flex-col gap-5 rounded-2xl md:rounded-[1.35rem] p-6 md:p-7"
      style={{
        border: `1px solid ${ds.borderStrong}`,
        backgroundImage: [
          'linear-gradient(125deg, rgba(255,132,17,0.06) 0%, transparent 42%, transparent 58%, rgba(232,204,101,0.045) 100%)',
          cardSurfaceBgImage,
        ].join(', '),
        backgroundColor: ds.cardElevated,
        boxShadow: `${cardTopHighlight}, 0 14px 40px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <blockquote className="flex-1 border-s-2 ps-4" style={{ borderColor: ds.warmIconBorder }}>
        <p
          className="text-[14.5px] md:text-[15px] leading-[1.72] text-pretty text-start"
          style={{ color: ds.textSecondary }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
      </blockquote>

      <footer
        className="pt-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: ds.textMuted }}
        >
          {item.role}
        </p>
      </footer>
    </article>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations('home.testimonials');
  const items = t.raw('items') as Testimonial[];
  const headingId = useId();
  const touchPauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [touchPaused, setTouchPaused] = useState(false);

  const clearTouchTimer = useCallback(() => {
    if (touchPauseTimeout.current) {
      clearTimeout(touchPauseTimeout.current);
      touchPauseTimeout.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      clearTouchTimer();
      setTouchPaused(true);
    },
    [clearTouchTimer]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      clearTouchTimer();
      touchPauseTimeout.current = setTimeout(() => setTouchPaused(false), 2400);
    },
    [clearTouchTimer]
  );

  const handlePointerLeave = useCallback(() => {
    clearTouchTimer();
    setTouchPaused(false);
  }, [clearTouchTimer]);

  const doubled = [...items, ...items];

  return (
    <section
      aria-labelledby={headingId}
      className={`${sectionPad} relative home-testimonials-marquee-zone`}
      style={{
        backgroundColor: ds.bgMain,
        borderTop: `1px solid ${ds.borderStrong}`,
        backgroundImage:
          'linear-gradient(180deg, rgba(255,132,17,0.022) 0%, transparent 42%), linear-gradient(90deg, rgba(232,204,101,0.015) 0%, transparent 38%, transparent 62%, rgba(232,204,101,0.015) 100%)',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className={`text-center max-w-[48rem] mx-auto ${sectionIntroBottom}`}>
          <p className={`inline-block text-[12px] font-bold uppercase tracking-[0.22em] mb-4 ${accentEyebrowClass}`}>
            {t('sectionLabel')}
          </p>
          <h2
            id={headingId}
            className="text-[1.75rem] sm:text-[2.15rem] md:text-[2.35rem] xl:text-[2.55rem] font-bold tracking-tight leading-[1.12] text-balance mb-5 md:mb-6"
            style={{ color: ds.text }}
          >
            {t('headline')}
          </h2>
          <p className="text-[1.02rem] md:text-[1.065rem] leading-[1.72] text-pretty" style={{ color: ds.textMuted }}>
            {t('intro')}
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-x-hidden mt-2 md:mt-4">
        <div
          className="pointer-events-none absolute inset-y-2 left-0 z-[2] w-10 sm:w-14 md:w-20"
          style={{ background: `linear-gradient(to right, ${ds.bgMain}, transparent)` }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-2 right-0 z-[2] w-10 sm:w-14 md:w-20"
          style={{ background: `linear-gradient(to left, ${ds.bgMain}, transparent)` }}
          aria-hidden
        />

        <div
          className={`home-testimonials-marquee-track flex w-max max-w-none gap-5 md:gap-7 lg:gap-8 py-3 md:py-5 ${
            touchPaused ? 'home-testimonials-marquee-track--paused' : ''
          }`}
        >
          {doubled.map((item, idx) => (
            <TestimonialCard
              key={`${item.role}-${idx}`}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
