'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  submitOrderAction,
  orderInitialActionState,
  type OrderActionState,
} from '@/app/actions/order';
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
  locale,
  display,
}: {
  locale: string;
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
  }, [state?.ok, state?.redirectTo, router]);

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

  const summaryEyebrow = display.usesFallbackSummary ? t('fallbackSummaryLabel') : t('summaryLabel');

  return (
    <form
      action={formAction}
      className="rounded-2xl md:rounded-[1.4rem] p-6 md:p-9 space-y-6 max-w-[640px]"
      style={{
        border: `1px solid ${ds.borderStrong}`,
        backgroundImage: cardSurfaceBgImage,
        backgroundColor: ds.cardElevated,
        boxShadow: `${cardTopHighlight}, 0 20px 52px rgba(0,0,0,0.38)`,
      }}
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="packageSlug" value={display.packageSlug ?? ''} />
      <input type="hidden" name="packageTitleSnapshot" value={display.packageTitle} />
      <input type="hidden" name="packagePriceSnapshot" value={display.packagePrice ?? ''} />
      <input type="hidden" name="packageCurrencySnapshot" value={display.currency ?? ''} />
      <input type="hidden" name="packageDescriptionSnapshot" value={display.description} />

      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          border: `1px solid rgba(232,204,101,0.18)`,
          backgroundColor: 'rgba(232,204,101,0.04)',
        }}
      >
        <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${accentEyebrowClass}`}>
          {summaryEyebrow}
        </span>
        <p className="text-lg font-semibold" style={{ color: ds.text }}>
          {display.packageTitle}
        </p>
        {display.packagePrice != null && display.packagePrice !== '' ? (
          <p className="text-[15px] font-medium tabular-nums" style={{ color: ds.textMuted }}>
            {display.packagePrice}{' '}
            {display.currency ? (
              <span className="text-[12px] font-normal">({display.currency})</span>
            ) : null}
          </p>
        ) : null}
        <p className="text-[14px] leading-relaxed" style={{ color: ds.textMuted }}>
          {display.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
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
        <div className="sm:col-span-2">
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
      </div>

      <div>
        <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="order-whatsapp">
          {t('fields.whatsapp')}
        </label>
        <input
          id="order-whatsapp"
          name="whatsapp"
          type="text"
          autoComplete="tel"
          placeholder={t('fields.whatsappPlaceholder')}
          disabled={pending}
          className={fieldClass}
          style={surfaceStyle}
        />
      </div>

      <div>
        <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="order-message">
          {t('fields.message')}
        </label>
        <textarea
          id="order-message"
          name="message"
          rows={5}
          placeholder={t('fields.messagePlaceholder')}
          disabled={pending}
          className={fieldClass}
          style={{ ...surfaceStyle, resize: 'vertical', minHeight: '7rem' }}
        />
      </div>

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
        className={`${primaryBtnClass} inline-flex w-full sm:w-auto items-center justify-center gap-2 px-10 py-3.5 rounded-xl text-[15px] font-semibold disabled:opacity-60`}
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {t('submit')}
      </button>
    </form>
  );
}
