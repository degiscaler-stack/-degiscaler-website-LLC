'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const services: string[] = t.raw('form.services') as string[];

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // Simulate submission
    await new Promise((res) => setTimeout(res, 1200));
    setStatus('success');
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#0d0d0d',
    border: '1px solid #2a2a2a',
    color: '#f5f5f5',
    borderRadius: '0.5rem',
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.375rem',
    color: '#a1a1aa',
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <div
        className="py-16 lg:py-20"
        style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            {t('headline')}
          </h1>
          <p className="text-base lg:text-lg" style={{ color: '#71717a' }}>
            {t('subheadline')}
          </p>
        </div>
      </div>

      <div className="py-16 lg:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-5">
              <div className="rounded-xl p-5" style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={14} style={{ color: '#FF8411' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#52525b' }}>
                    {t('info.emailLabel')}
                  </span>
                </div>
                <a href="mailto:support@degiscaler.com" className="text-sm" style={{ color: '#a1a1aa' }}>
                  {t('info.email')}
                </a>
              </div>

              <div className="rounded-xl p-5" style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} style={{ color: '#FF8411' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#52525b' }}>
                    {t('info.responseLabel')}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#a1a1aa' }}>{t('info.response')}</p>
              </div>

              <div className="rounded-xl p-5" style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#52525b' }}>
                  {t('info.trustNote')}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div
                  className="rounded-xl p-8 flex flex-col items-center text-center gap-4"
                  style={{ backgroundColor: '#0d0d0d', border: '1px solid rgba(255,132,17,0.2)' }}
                >
                  <CheckCircle2 size={40} style={{ color: '#FF8411' }} />
                  <h2 className="text-lg font-semibold" style={{ color: '#f5f5f5' }}>{t('form.successTitle')}</h2>
                  <p className="text-sm" style={{ color: '#71717a' }}>{t('form.successText')}</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-xl p-6 lg:p-8 space-y-5"
                  style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={labelStyle} htmlFor="name">{t('form.name')}</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder={t('form.namePlaceholder')}
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="email">{t('form.email')}</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder={t('form.emailPlaceholder')}
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="subject">{t('form.subject')}</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder={t('form.subjectPlaceholder')}
                      value={form.subject}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="service">{t('form.service')}</label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      style={{ ...inputStyle, appearance: 'none' }}
                    >
                      <option value="">{t('form.servicePlaceholder')}</option>
                      {services.map((svc) => (
                        <option key={svc} value={svc}>{svc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="message">{t('form.message')}</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={t('form.messagePlaceholder')}
                      value={form.message}
                      onChange={handleChange}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#ef4444' }}>
                      <AlertCircle size={14} />
                      {t('form.errorText')}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: status === 'sending' ? '#cc6d0e' : '#FF8411',
                      color: '#ffffff',
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {status === 'sending' ? t('form.sending') : t('form.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
