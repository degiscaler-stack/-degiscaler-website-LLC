'use client';

import { Link } from '@/i18n/navigation';
import { logoBrandClass } from '@/components/home/homeTheme';

/** Shared header + footer wordmark — Degi (white) + Scaler (accent gradient). */
export default function BrandLogo() {
  return (
    <Link
      href="/"
      className="logo-brand-group inline-flex shrink-0 items-baseline gap-0 whitespace-nowrap group"
      aria-label="DegiScaler — Home"
    >
      <span className="text-[1.35rem] md:text-[1.45rem] font-bold text-[#F5F2E9] tracking-[-0.045em] leading-none">
        Degi
      </span>
      <span className={`text-[1.35rem] md:text-[1.45rem] font-bold tracking-[-0.045em] leading-none ${logoBrandClass}`}>
        Scaler
      </span>
    </Link>
  );
}
