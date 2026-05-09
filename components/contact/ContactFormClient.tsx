'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Clock, Briefcase, AlertCircle } from 'lucide-react';
import {
  ds,
  accentEyebrowClass,
  primaryBtnClass,
  cardSurfaceBgImage,
  cardTopHighlight,
  iconWellGlyphClass,
} from '@/components/home/homeTheme';

/**
 * Form submission: connect to your API route, email provider (e.g. Resend, SendGrid),
 * or server action. Until then, submit shows a notice and offers a mailto fallback (no fake “sent” state).
 */
export default function ContactFormClient() {
  const t = useTranslations('contactPage');
  const [form, setForm] = useState({
    name: '',
    email: '',
    businessProject: '',
    budgetPackage: '',
    message: '',
  });
  const [showNotice, setShowNotice] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowNotice(true);
  }

  const mailtoBody = [
    `${t('form.mailtoName')}: ${form.name}`,
    `${t('form.mailtoEmail')}: ${form.email}`,
    `${t('form.businessProject')}: ${form.businessProject}`,
    `${t('form.budgetPackage')}: ${form.budgetPackage}`,
    '',
    form.message,
  ].join('\n');

  const mailtoHref = `mailto:support@degiscaler.com?subject=${encodeURIComponent(
    t('form.mailtoSubject')
  )}&body=${encodeURIComponent(mailtoBody)}`;

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
          onSubmit={handleSubmit}
          className="rounded-2xl md:rounded-[1.4rem] p-6 md:p-9 space-y-6"
          style={{
            border: `1px solid ${ds.borderStrong}`,
            backgroundImage: cardSurfaceBgImage,
            backgroundColor: ds.cardElevated,
            boxShadow: `${cardTopHighlight}, 0 20px 52px rgba(0,0,0,0.38)`,
          }}
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-name">
                {t('form.name')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder={t('form.namePlaceholder')}
                value={form.name}
                onChange={handleChange}
                className={fieldClass}
                style={surfaceStyle}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-email">
                {t('form.email')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t('form.emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
                className={fieldClass}
                style={surfaceStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} style={{ color: ds.textMuted }} htmlFor="contact-business">
              {t('form.businessProject')}
            </label>
            <input
              id="contact-business"
              name="businessProject"
              type="text"
              required
              placeholder={t('form.businessProjectPlaceholder')}
              value={form.businessProject}
              onChange={handleChange}
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
              name="budgetPackage"
              type="text"
              required
              placeholder={t('form.budgetPackagePlaceholder')}
              value={form.budgetPackage}
              onChange={handleChange}
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
              required
              rows={6}
              placeholder={t('form.messagePlaceholder')}
              value={form.message}
              onChange={handleChange}
              className={fieldClass}
              style={{ ...surfaceStyle, resize: 'vertical', minHeight: '9rem' }}
            />
          </div>

          {showNotice && (
            <div
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{
                border: `1px solid ${ds.warmIconBorder}`,
                backgroundColor: 'rgba(255,132,17,0.06)',
              }}
              role="status"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} style={{ color: ds.iconGold }} aria-hidden />
                <div>
                  <p className="text-[15px] font-semibold mb-1" style={{ color: ds.text }}>
                    {t('form.notConfiguredTitle')}
                  </p>
                  <p className="text-[14px] leading-[1.65]" style={{ color: ds.textMuted }}>
                    {t('form.notConfiguredText')}
                  </p>
                </div>
              </div>
              <a
                href={mailtoHref}
                className={`${primaryBtnClass} inline-flex justify-center px-6 py-3 rounded-xl text-[14px] font-semibold w-full sm:w-auto`}
              >
                {t('form.emailUsButton')}
              </a>
            </div>
          )}

          <button type="submit" className={`${primaryBtnClass} w-full sm:w-auto px-10 py-3.5 rounded-xl text-[15px] font-semibold`}>
            {t('form.submit')}
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
