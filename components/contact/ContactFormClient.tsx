'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Clock, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { submitContactAction } from '@/app/actions/contact';
import {
  contactInitialActionState,
  type ContactActionState,
} from '@/lib/actions/public-form-state';
import {
  ds,
  accentEyebrowClass,
  primaryBtnClass,
  cardSurfaceBgImage,
  cardTopHighlight,
  iconWellGlyphClass,
} from '@/components/home/homeTheme';

export default function ContactFormClient({ locale }: { locale: string }) {
  const t = useTranslations('contactPage');
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ContactActionState, FormData>(
    submitContactAction,
    contactInitialActionState,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <div className="space-y-5">
        <div
          className="rounded-2xl p-6 flex flex-col gap-3"
          style={{
            border: `1px solid ${ds.borderStrong}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.cardElevated,
            boxShadow: `${cardTopHighlight}, 0 14px 36px rgba(0,0,0,0.28)`,
          }}
        >
          <div className={`${iconWellGlyphClass} flex size-11 items-center justify-center rounded-xl w-fit`}>
            <Mail size={20} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${accentEyebrowClass}`}>
            {t('info.emailLabel')}
          </span>
          <a href="mailto:support@degiscaler.com" className="text-[15px] font-medium break-all hover:opacity-90" style={{ color: ds.textSecondary }}>
            {t('info.email')}
          </a>
        </div>

        <div
          className="rounded-2xl p-6 flex flex-col gap-3"
          style={{
            border: `1px solid ${ds.borderStrong}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.card,
            boxShadow: `${cardTopHighlight}, 0 12px 32px rgba(0,0,0,0.24)`,
          }}
        >
          <div className={`${iconWellGlyphClass} flex size-11 items-center justify-center rounded-xl w-fit`}>
            <Clock size={20} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${accentEyebrowClass}`}>
            {t('info.responseLabel')}
          </span>
          <p className="text-[15px] leading-relaxed" style={{ color: ds.textMuted }}>
            {t('info.response')}
          </p>
        </div>

        <div
          className="rounded-2xl p-6 flex flex-col gap-3"
          style={{
            border: `1px solid ${ds.borderStrong}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.card,
            boxShadow: `${cardTopHighlight}, 0 12px 32px rgba(0,0,0,0.24)`,
          }}
        >
          <div className={`${iconWellGlyphClass} flex size-11 items-center justify-center rounded-xl w-fit`}>
            <Briefcase size={20} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
          </div>
          <p className="text-[14.5px] leading-[1.72]" style={{ color: ds.textMuted }}>
            {t('info.scopeLine')}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <form
          action={formAction}
          className="rounded-2xl md:rounded-[1.4rem] p-6 md:p-9 space-y-6"
          style={{
            border: `1px solid ${ds.borderStrong}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.cardElevated,
            boxShadow: `${cardTopHighlight}, 0 20px 52px rgba(0,0,0,0.38)`,
          }}
          noValidate
        >
          <input type="hidden" name="locale" value={locale} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-fullName">
                {t('form.fullName')} *
              </label>
              <input
                id="contact-fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                placeholder={t('form.fullNamePlaceholder')}
                disabled={pending}
                className={fieldClass}
                style={surfaceStyle}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-email">
                {t('form.email')} *
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t('form.emailPlaceholder')}
                disabled={pending}
                className={fieldClass}
                style={surfaceStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-whatsapp">
              {t('form.whatsapp')}
            </label>
            <input
              id="contact-whatsapp"
              name="whatsapp"
              type="text"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t('form.whatsappPlaceholder')}
              disabled={pending}
              className={fieldClass}
              style={surfaceStyle}
            />
          </div>

          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-budget">
              {t('form.budgetPackage')}
            </label>
            <input
              id="contact-budget"
              name="budgetOrPackage"
              type="text"
              placeholder={t('form.budgetPackagePlaceholder')}
              disabled={pending}
              className={fieldClass}
              style={surfaceStyle}
            />
          </div>

          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-message">
              {t('form.message')}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              placeholder={t('form.messagePlaceholder')}
              disabled={pending}
              className={fieldClass}
              style={{ ...surfaceStyle, resize: 'vertical', minHeight: '9rem' }}
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
            {pending ? t('form.submitting') : t('form.submit')}
          </button>
        </form>

        <div
          className="rounded-2xl p-7 md:p-8"
          style={{
            border: `1px solid ${ds.borderStrong}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.card,
            boxShadow: `${cardTopHighlight}, 0 12px 32px rgba(0,0,0,0.22)`,
          }}
        >
          <span className={`block text-[12px] font-bold uppercase tracking-[0.18em] mb-3 ${accentEyebrowClass}`}>
            {t('expectationTitle')}
          </span>
          <p className="text-[15px] leading-[1.72] mb-6" style={{ color: ds.textMuted }}>
            {t('expectationText')}
          </p>
          <p className="text-[14px] leading-[1.7]" style={{ color: ds.textMuted }}>
            {t('info.trustNote')}
          </p>
        </div>
      </div>
    </div>
  );
}
