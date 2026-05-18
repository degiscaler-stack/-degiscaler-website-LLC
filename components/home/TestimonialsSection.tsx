'use client';

import Image from 'next/image';
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
  /** Optional `/public` path e.g. `/testimonials/avatar-1.svg` */
  avatar?: string;
};

function testimonialAvatarSrc(item: Testimonial): string {
  const direct = item.avatar?.trim();
  if (direct) return direct;
  let h = 0;
  const n = item.name;
  for (let i = 0; i < n.length; i += 1) {
    h = (h * 31 + n.charCodeAt(i)) >>> 0;
  }
  return `/testimonials/woman-${(h % 2) + 1}.webp`;
}

function starFillState(ratingStr: string, index: number): 'full' | 'soft' | 'dim' {
  const n = Number.parseFloat(ratingStr);
  if (Number.isNaN(n) || n < 0) return 'dim';
  const f = Math.floor(n);
  const frac = n - f;
  if (index < f) return 'full';
  if (index === f && frac >= 0.25) return 'soft';
  return 'dim';
}

/** CSS-only “avatar”: initials in a metallic orb (no external images). */
function testimonialAvatarInitials(name: string): string {
  const n = name.trim();
  if (!n) return '—';
  const parts = n.split(/\s+/).filter(Boolean);
  const firstGrapheme = (s: string) => [...s][0] ?? '';
  if (parts.length >= 2) {
    return `${firstGrapheme(parts[0])}${firstGrapheme(parts[1])}`;
  }
  return [...parts[0]].slice(0, 2).join('');
}

function avatarOrbAngle(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 72;
}

function TestimonialAvatarImage({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <TestimonialAvatarGlyph name={name} />;
  return (
    <Image
      src={src}
      alt=""
      width={56}
      height={56}
      className="size-14 shrink-0 rounded-full object-cover ring-1 ring-[rgba(232,204,101,0.28)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_24px_rgba(0,0,0,0.55)]"
      onError={() => setFailed(true)}
    />
  );
}

function TestimonialAvatarGlyph({ name }: { name: string }) {
  const label = testimonialAvatarInitials(name);
  const tilt = avatarOrbAngle(name);

  return (
    <div
      className="relative size-[52px] shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(232,204,101,0.28)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_24px_rgba(0,0,0,0.55)]"
      aria-hidden
      style={{
        backgroundImage: [
          `conic-gradient(from ${tilt}deg, rgba(232,204,101,0.42) 0%, rgba(255,132,17,0.18) 32%, rgba(21,22,26,1) 58%, rgba(214,167,0,0.22) 100%)`,
          'radial-gradient(135% 120% at 28% 18%, rgba(255,255,255,0.16) 0%, transparent 48%)',
        ].join(', '),
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -8px 18px rgba(0,0,0,0.42), 0 10px 24px rgba(0,0,0,0.55)',
      }}
    >
      <span
        className="flex size-full items-center justify-center text-[13.5px] font-bold uppercase leading-none tracking-[0.04em]"
        style={{
          textShadow:
            '0 1px 0 rgba(0,0,0,0.55), 0 0 18px rgba(214,167,0,0.35)',
          color: ds.text,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function GradientStar({
  gradientId,
  state,
}: {
  gradientId: string;
  state: 'full' | 'soft' | 'dim';
}) {
  const opacity = state === 'full' ? 1 : state === 'soft' ? 0.58 : 0.22;
  const luminous =
    state === 'full'
      ? 'drop-shadow(0 0 2.5px rgba(255,132,17,0.85)) drop-shadow(0 0 7px rgba(214,167,0,0.42)) drop-shadow(0 0 12px rgba(232,204,101,0.18))'
      : state === 'soft'
        ? 'drop-shadow(0 0 2px rgba(255,132,17,0.35)) drop-shadow(0 0 5px rgba(214,167,0,0.22))'
        : 'none';

  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      className="shrink-0"
      aria-hidden
      style={{ opacity, filter: luminous }}
    >
      <path
        fill={`url(#${gradientId})`}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
}

function TestimonialCard({
  item,
  avatarSrc,
  ratingSuffix,
  starGradientId,
}: {
  item: Testimonial;
  avatarSrc: string;
  ratingSuffix: string;
  starGradientId: string;
}) {
  return (
    <article
      className="testimonial-card-marquee flex w-[min(100%,320px)] sm:w-[340px] lg:w-[360px] shrink-0 flex-col gap-5 rounded-2xl md:rounded-[1.35rem] p-6 md:p-7"
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
      <div className="flex items-start gap-4">
        <TestimonialAvatarImage name={item.name} src={avatarSrc} />
        <div className="min-w-0 flex-1 text-start">
          <p className="text-[15.5px] font-bold leading-snug tracking-tight" style={{ color: ds.text }}>
            {item.name}
          </p>
          <p className="text-[13px] font-medium leading-snug mt-1" style={{ color: ds.textMuted }}>
            {item.role}
          </p>
          {item.meta ? (
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] mt-2" style={{ color: ds.textMuted }}>
              {item.meta}
            </p>
          ) : null}
        </div>
      </div>

      {item.rating ? (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <GradientStar key={i} gradientId={starGradientId} state={starFillState(item.rating, i)} />
            ))}
          </div>
          <span className="text-[13.5px] font-bold tabular-nums" style={{ color: '#ffffff' }}>
            {item.rating}
            {ratingSuffix}
          </span>
        </div>
      ) : null}

      <blockquote className="border-s-2 ps-4" style={{ borderColor: ds.warmIconBorder }}>
        <p className="text-[14.5px] md:text-[15px] leading-[1.72] text-pretty text-start" style={{ color: ds.textSecondary }}>
          &ldquo;{item.quote}&rdquo;
        </p>
      </blockquote>
    </article>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations('home.testimonials');
  const items = t.raw('items') as Testimonial[];
  const ratingSuffix = t('ratingOutOf');
  const headingId = useId();
  const rawGradId = useId();
  const starGradientId = `hts-${rawGradId.replace(/:/g, '')}`;
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
      <svg
        width={1}
        height={1}
        className="pointer-events-none absolute left-0 top-0 overflow-hidden opacity-0"
        aria-hidden
        focusable={false}
      >
        <defs>
          <linearGradient id={starGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="12%" stopColor="#ff8411" />
            <stop offset="50%" stopColor="#d6a700" />
            <stop offset="92%" stopColor="#e8cc65" />
          </linearGradient>
        </defs>
      </svg>

      <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
        <div className={`text-center max-w-[48rem] mx-auto ${sectionIntroBottom}`}>
          <p className={`inline-block text-[12px] font-bold uppercase tracking-[0.22em] mb-4 ${accentEyebrowClass}`}>{t('sectionLabel')}</p>
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
          style={{
            background: `linear-gradient(to right, ${ds.bgMain}, transparent)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-2 right-0 z-[2] w-10 sm:w-14 md:w-20"
          style={{
            background: `linear-gradient(to left, ${ds.bgMain}, transparent)`,
          }}
          aria-hidden
        />

        <div
          className={`home-testimonials-marquee-track flex w-max max-w-none gap-5 md:gap-7 lg:gap-8 py-3 md:py-5 ${
            touchPaused ? 'home-testimonials-marquee-track--paused' : ''
          }`}
        >
          {doubled.map((item, idx) => (
            <TestimonialCard
              key={`${item.name}-${idx}`}
              item={item}
              avatarSrc={testimonialAvatarSrc(item)}
              ratingSuffix={ratingSuffix}
              starGradientId={starGradientId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
