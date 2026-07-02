'use client';

import { useId } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Gauge,
  ClipboardCheck,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import {
  ds,
  contentMax,
  heroEyebrowClass,
  accentEyebrowClass,
  accentStatClass,
  accentDotMicroClass,
  primaryBtnClass,
  secondaryBtnClass,
  iconWellGlyphClass,
  iconWellSmGlyphClass,
  cardSurfaceBgImage,
  cardTopHighlight,
} from './homeTheme';

const TRUST_KEYS = ['trust1', 'trust2', 'trust3'] as const;
const TRUST_ICONS = [Building2, BadgeCheck, Gauge] as const;
const ROW_KEYS = ['trustSignals', 'checkout', 'mobile', 'policy'] as const;

/** Balanced hero: stretched two-column composition + full-height readiness panel. */
export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section
      className="relative overflow-x-clip overflow-hidden pt-0 pb-[64px] md:pb-[76px] lg:pb-[96px] xl:pb-[112px]"
      style={{
        background: `linear-gradient(180deg, ${ds.bgDeep} 0%, ${ds.bgMain} 55%, ${ds.bgMain} 100%)`,
      }}
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            `linear-gradient(90deg, rgba(255,132,17,0.06) 0%, transparent 18%, transparent 82%, rgba(232,204,101,0.045) 100%)`,
            `linear-gradient(180deg, rgba(232,204,101,0.03) 0%, transparent 42%)`,
          ].join(', '),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.42) 100%)`,
        }}
      />

      <div
        id="hero-heading"
        className={`${contentMax} relative z-10 px-4 sm:px-6 lg:px-8 pt-[7rem] sm:pt-[7.125rem] md:pt-[7.375rem] lg:pt-[7.625rem]`}
      >
        <div className="grid min-w-0 grid-cols-1 gap-y-9 xl:grid-cols-[minmax(0,48%)_minmax(0,52%)] xl:gap-x-[4rem] xl:gap-y-0 xl:items-stretch">
          {/* Left — vertically centered vs. panel on desktop */}
          <div className="flex min-w-0 max-w-xl flex-col justify-center xl:max-w-none xl:justify-center xl:py-2 xl:pe-1">
            <p className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] mb-3 md:mb-4 ${heroEyebrowClass}`}>
              {t('badge')}
            </p>

            <h1
              className="text-[2rem] sm:text-[2.45rem] md:text-[3rem] lg:text-[3.35rem] font-bold tracking-tight leading-[1.12] mb-5 md:mb-6 text-balance max-w-[26ch] sm:max-w-[34ch] xl:max-w-none text-start text-[#F5F2E9]"
            >
              {t('headline')}
            </h1>

            <p className="text-[1.045rem] sm:text-[1.07rem] md:text-[1.1rem] leading-[1.74] mb-6 md:mb-7 max-w-[36rem] text-start" style={{ color: ds.textSecondary }}>
              {t('subheadline')}
            </p>

            <ul
              className="grid min-w-0 grid-cols-1 grid-rows-none gap-2 auto-rows-fr min-[440px]:grid-cols-2 lg:grid-cols-3 mb-7 md:mb-8 text-start"
              role="list"
              aria-label={t('badge')}
            >
              {TRUST_KEYS.map((key, idx) => {
                const Icon = TRUST_ICONS[idx] ?? Gauge;
                return (
                  <li
                    key={key}
                    className="flex min-h-[52px] w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5"
                    style={{
                      borderColor: ds.borderStrong,
                      backgroundImage: cardSurfaceBgImage,
                      backgroundColor: ds.cardElevated,
                      boxShadow: cardTopHighlight,
                      color: ds.textSecondary,
                    }}
                  >
                    <span className={`${iconWellGlyphClass} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl`}>
                      <Icon className="h-5 w-5" aria-hidden strokeWidth={1.9} style={{ color: ds.iconGold }} />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug sm:text-[13.5px]">{t(key)}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/services"
                className={`group ${primaryBtnClass} inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold tracking-tight sm:w-auto md:px-8 md:py-4 md:text-[16px]`}
              >
                {t('ctaPrimary')}
                <ArrowRight
                  size={18}
                  className="-me-1 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/pricing"
                className={`${secondaryBtnClass} inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold sm:w-auto md:px-8 md:py-4 md:text-[16px]`}
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Right — full-height premium panel */}
          <div className="flex min-h-0 w-full justify-center xl:justify-end xl:py-2">
            <HeroReadinessPanel ariaLabel={t('dashboardAria')} />
          </div>
        </div>
      </div>
    </section>
  );
}

const FINDING_ICONS = [Gauge, ClipboardList, ShieldCheck] as const;

function HeroQuickFindings() {
  const t = useTranslations('home.hero');
  const raw = t.raw('quickFindings.items') as { label: string; detail: string }[] | undefined;
  const items = Array.isArray(raw) ? raw : [];

  if (items.length === 0) return null;

  return (
    <section
      className="mt-4 flex min-h-[7.5rem] flex-1 flex-col rounded-xl border px-3 py-3 md:mt-4 md:px-4 md:py-3.5"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundImage: cardSurfaceBgImage,
        backgroundColor: 'rgba(8,9,11,0.92)',
        boxShadow: `${cardTopHighlight}, inset 0 1px 0 rgba(232,204,101,0.04)`,
      }}
      aria-labelledby="hero-quick-findings-title"
    >
      <h2 id="hero-quick-findings-title" className={`mb-2.5 md:mb-3 text-[10px] font-bold uppercase tracking-[0.16em] ${accentEyebrowClass}`}>
        {t('quickFindings.title')}
      </h2>
      <ul className="flex flex-1 flex-col justify-center gap-2.5 ps-0 list-none" role="list">
        {items.map((item, i) => {
          const Icon = FINDING_ICONS[i] ?? ShieldCheck;
          return (
            <li key={i} className="flex gap-3 text-start" role="listitem">
              <span className={`${iconWellSmGlyphClass} mt-px flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg`}>
                <Icon className="h-[14px] w-[14px]" strokeWidth={2} aria-hidden style={{ color: ds.iconGold }} />
              </span>
              <div className="min-w-0 flex-1 space-y-0.5 pt-px">
                <span className="block text-[12px] font-semibold leading-snug md:text-[12.5px]" style={{ color: ds.text }}>
                  {item.label}
                </span>
                <span className="block text-[11px] leading-snug md:text-[11.5px]" style={{ color: ds.textMuted }}>
                  {item.detail}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function HeroReadinessPanel({ ariaLabel }: { ariaLabel: string }) {
  const t = useTranslations('home.hero');
  const badges = (t.raw('audit.badges') as string[] | undefined) ?? [];
  const strip = badges.slice(0, 3);

  return (
    <div
      className="flex h-full min-h-[340px] w-full max-w-[600px] flex-col rounded-2xl border p-4 md:p-5 xl:max-h-none xl:min-h-0 xl:p-7"
      role="presentation"
      style={{
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundImage: [
          `linear-gradient(90deg, rgba(255,132,17,0.08) 0%, transparent 14%, transparent 86%, rgba(232,204,101,0.06) 100%)`,
          `linear-gradient(180deg, rgba(232,204,101,0.03) 0%, transparent 38%)`,
          cardSurfaceBgImage,
        ].join(', '),
        backgroundColor: '#101113',
        boxShadow: `${cardTopHighlight}, 0 32px 72px rgba(0,0,0,0.48)`,
      }}
    >
      <div className="shrink-0 w-full" role="figure" aria-label={ariaLabel}>
        <ReadinessDashboardCard />
      </div>

      <HeroQuickFindings />

      {strip.length > 0 && (
        <div
          className="shrink-0 grid grid-cols-3 gap-2 border-t pt-4 md:gap-3 md:pt-5"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          role="list"
          aria-label={t('audit.chipLabel')}
        >
          {strip.map((label) => (
            <div
              key={label}
              role="listitem"
              className="flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center"
              style={{
                borderColor: 'rgba(232,204,101,0.18)',
                background: 'rgba(5,5,5,0.35)',
              }}
            >
              <span className={`${accentDotMicroClass} mx-auto shrink-0`} aria-hidden />
              <span className="w-full truncate text-[10px] font-semibold uppercase tracking-wide leading-tight" style={{ color: ds.textSecondary }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadinessDashboardCard() {
  const t = useTranslations('home.hero');
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ringGradientId = `hero-ring-${uid}`;

  const rows = ROW_KEYS.map((k) => ({
    label: t(`audit.rows.${k}.label`),
    pct: Number(t.raw(`audit.rows.${k}.pct`)),
  }));

  const badges = (t.raw('audit.badges') as string[] | undefined) ?? [];

  const score = Number(t.raw(`audit.bigScore`)) || 94;
  const circumference = 2 * Math.PI * 38;

  return (
    <div
      className="w-full overflow-hidden rounded-xl border"
      style={{
        backgroundImage: cardSurfaceBgImage,
        borderColor: 'rgba(255,255,255,0.1)',
        boxShadow: `${cardTopHighlight}, 0 20px 52px rgba(0,0,0,0.42)`,
        maxHeight: 'none',
      }}
    >
      <div
        className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5"
        style={{
          background: 'linear-gradient(180deg, #17181c 0%, #0d0e11 100%)',
          borderColor: ds.border,
        }}
      >
        <div className="flex shrink-0 gap-1.5" aria-hidden>
          {['#57534e', '#737373', '#44403c'].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full opacity-90" style={{ background: c }} />
          ))}
        </div>
        <p
          className="flex-1 truncate text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em]"
          style={{ color: ds.textMuted }}
        >
          {t('audit.title')}
        </p>
        <span className="w-8 shrink-0" aria-hidden />
      </div>

      <div className="min-h-0 overflow-hidden px-5 pb-4 pt-3.5 md:px-6 md:pb-5" style={{ backgroundImage: cardSurfaceBgImage }}>
        <p className={`mb-3 truncate text-center text-[10px] font-semibold uppercase tracking-[0.14em] opacity-90 ${accentEyebrowClass}`}>
          {t('audit.url')}
        </p>

        <div className="flex flex-wrap items-start gap-4 border-b pb-3.5" style={{ borderColor: ds.border }}>
          <div className="relative h-[100px] w-[100px] shrink-0" aria-hidden>
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={38} stroke="rgba(255,255,255,0.06)" strokeWidth={7} fill="none" />
              <circle
                cx="50"
                cy="50"
                r={38}
                stroke={`url(#${ringGradientId})`}
                strokeWidth={7}
                fill="none"
                strokeDasharray={`${(circumference * score) / 100} ${circumference}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff8411" />
                  <stop offset="48%" stopColor="#d6a700" />
                  <stop offset="100%" stopColor="#e8cc65" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className={`text-[29px] font-bold tabular-nums leading-none md:text-[31px] ${accentStatClass}`}>
                {t('audit.bigScore')}
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 basis-[12rem] flex-col gap-2.5">
            {badges.length > 0 && (
              <div className="flex flex-wrap justify-start gap-1.5">
                {badges.map((b) => (
                  <span
                    key={b}
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] md:text-[10px] ${accentEyebrowClass}`}
                    style={{
                      backgroundColor: 'rgba(255,132,17,0.05)',
                      borderColor: ds.warmIconBorder,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            <div
              className="flex max-w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-start"
              style={{
                borderColor: ds.warmIconBorder,
                backgroundColor: 'rgba(8,8,10,0.65)',
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,132,17,0.12) 0%, rgba(214,167,0,0.06) 48%, rgba(232,204,101,0.11) 100%)',
              }}
            >
              <span className={`${iconWellSmGlyphClass} inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg`}>
                <ClipboardCheck className="h-4 w-4" strokeWidth={2} style={{ color: ds.iconGold }} aria-hidden />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <span className={`block text-[8px] font-bold uppercase tracking-[0.1em] md:text-[9px] ${accentEyebrowClass}`}>
                  {t('audit.chipLabel')}
                </span>
                <span className="block text-pretty text-[11px] font-semibold md:text-[12px]" style={{ color: ds.text }}>
                  {t('audit.chipValue')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-3 space-y-2.5 ps-0 list-none" role="list">
          {rows.map((r) => (
            <li key={r.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-start">
                <span className="truncate text-[11px] font-semibold md:text-[12px]" style={{ color: ds.text }}>
                  {r.label}
                </span>
                <span className="shrink-0 text-[11px] font-bold tabular-nums leading-none" style={{ color: ds.textMuted }}>
                  {r.pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full"
                    style={{
                    width: `${r.pct}%`,
                    background: 'linear-gradient(90deg, #ff8411 0%, #d6a700 46%, #e8cc65 100%)',
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
