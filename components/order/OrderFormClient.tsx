'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { submitOrderAction } from '@/app/actions/order';
import {
  orderInitialActionState,
  type OrderActionState,
} from '@/lib/actions/public-form-state';
import {
  ds,
  accentEyebrowClass,
  primaryBtnClass,
  cardSurfaceBgImage,
  cardTopHighlight,
} from '@/components/home/homeTheme';

export type OrderFormDisplay = {
  packageSlug: string | null;
  packageTitle: string;
  packagePrice: string | null;
  currency: string | null;
  description: string;
  usesFallbackSummary: boolean;
};

export default function OrderFormClient({
  display,
}: {
  display: OrderFormDisplay;
}) {
  const t = useTranslations('orderPage');
  const router = useRouter();
  const [state, formAction, pending] = useActionState<OrderActionState, FormData>(
    submitOrderAction,
    orderInitialActionState,
  );

  useEffect(() => {
    if (state?.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state?.ok, state.redirectTo, router]);

  const fieldClass =
    'w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-[box-shadow] focus:ring-2 focus:ring-[rgba(255,132,17,0.35)]';
  const labelClass = 'block text-[12px] font-semibold uppercase tracking-wider mb-2';
  const surfaceStyle: React.CSSProperties = {
    border: `1px solid ${ds.borderStrong}`,
    backgroundImage: cardSurfaceBgImage,
    backgroundColor: ds.card,
    color: ds.text,
    boxShadow: `${cardTopHighlight}, inset 0 1px 0 rgba(255,255,255,0.04)`,
  };

  const summaryEyebrow = display.usesFallbackSummary ? t('fallbackSummaryLabel') : t('orderSummaryTitle');

  const infoPanelClass =
    'rounded-xl p-4 md:p-5 space-y-2 border border-solid';
  const infoPanelStyle: React.CSSProperties = {
    borderColor: ds.borderStrong,
    backgroundImage: cardSurfaceBgImage,
    backgroundColor: ds.card,
    boxShadow: `${cardTopHighlight}, inset 0 1px 0 rgba(255,255,255,0.04)`,
  };

  return (
    <form
      action={formAction}
      className="rounded-2xl md:rounded-[1.4rem] p-6 md:p-8 space-y-5 max-w-[640px]"
      style={{
        border: `1px solid ${ds.borderStrong}`,
        backgroundImage: cardSurfaceBgImage,
        backgroundColor: ds.cardElevated,
        boxShadow: `${cardTopHighlight}, 0 20px 52px rgba(0,0,0,0.38)`,
      }}
      noValidate
    >
      <input type="hidden" name="locale" value="en" />
      <input type="hidden" name="packageSlug" value={display.packageSlug ?? ''} />
      <input type="hidden" name="packageTitleSnapshot" value={display.packageTitle} />
      <input type="hidden" name="packagePriceSnapshot" value={display.packagePrice ?? ''} />
      <input type="hidden" name="packageCurrencySnapshot" value={display.currency ?? ''} />
      <input type="hidden" name="packageDescriptionSnapshot" value={display.description} />

      <div
        className="rounded-xl p-5 space-y-3 border border-solid"
        style={{
          borderColor: 'rgba(232,204,101,0.2)',
          backgroundColor: 'rgba(232,204,101,0.04)',
        }}
      >
        <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${accentEyebrowClass}`}>
          {summaryEyebrow}
        </span>
        <p className="text-lg font-semibold leading-snug" style={{ color: ds.text }}>
          {display.packageTitle}
        </p>
        {display.packagePrice != null && display.packagePrice !== '' ? (
          <div
            className="flex flex-wrap items-baseline justify-between gap-3 pt-2 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: ds.textMuted }}>
              {t('totalLabel')}
            </span>
            <p className="text-[17px] font-bold tabular-nums" style={{ color: ds.text }}>
              {display.packagePrice}{' '}
              {display.currency ? (
                <span className="text-[12px] font-semibold">({display.currency})</span>
              ) : null}
            </p>
          </div>
        ) : null}
        <p className="text-[13px] md:text-[14px] leading-relaxed line-clamp-4" style={{ color: ds.textMuted }}>
          {display.description}
        </p>
        <p className="text-[12px] md:text-[13px] leading-relaxed pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', color: ds.textSecondary }}>
          {t('orderSummaryDeliveryNotice')}
        </p>
      </div>

      <div className={`${infoPanelClass}`} style={infoPanelStyle}>
        <p className={`text-[12px] font-bold uppercase tracking-wider ${accentEyebrowClass}`}>
          {t('digitalDeliveryTitle')}
        </p>
        <p className="text-[13px] md:text-[14px] leading-relaxed" style={{ color: ds.textMuted }}>
          {t('digitalDeliveryBody')}
        </p>
      </div>

      <div className={`${infoPanelClass}`} style={infoPanelStyle}>
        <p className={`text-[12px] font-bold uppercase tracking-wider ${accentEyebrowClass}`}>
          {t('secureCheckoutTitle')}
        </p>
        <p className="text-[13px] md:text-[14px] leading-relaxed" style={{ color: ds.textMuted }}>
          {t('secureCheckoutBody')}
        </p>
      </div>

      <div>
        <p className={`text-[12px] font-bold uppercase tracking-wider mb-4 ${accentEyebrowClass}`}>
          {t('billingSectionTitle')}
        </p>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="order-fullName">
              {t('fields.fullName')} *
            </label>
            <input
              id="order-fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder={t('fields.fullNamePlaceholder')}
              disabled={pending}
              className={fieldClass}
              style={surfaceStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="order-email">
              {t('fields.email')} *
            </label>
            <input
              id="order-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t('fields.emailPlaceholder')}
              disabled={pending}
              className={fieldClass}
              style={surfaceStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="order-country">
              {t('fields.country')} *
            </label>
            <input
              id="order-country"
              name="country"
              type="text"
              required
              autoComplete="country-name"
              placeholder={t('fields.countryPlaceholder')}
              disabled={pending}
              className={fieldClass}
              style={surfaceStyle}
            />
          </div>
        </div>
      </div>

      <p className="text-[12px] leading-relaxed" style={{ color: ds.textMuted }}>
        {t('complianceNotice')}
      </p>

      {state?.error ? (
        <div
          className="rounded-lg border border-red-500/35 bg-red-950/30 px-4 py-3 text-sm text-red-100"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`${primaryBtnClass} inline-flex w-full items-center justify-center gap-2 px-10 py-3.5 rounded-xl text-[15px] font-semibold disabled:opacity-60`}
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {t('continueSecureCheckout')}
      </button>
    </form>
  );
}
