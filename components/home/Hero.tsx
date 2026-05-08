import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Shield, Package, Globe, AlertCircle } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('home.hero');

  const trustPoints = [
    { icon: Shield, key: 'trust1' },
    { icon: Package, key: 'trust2' },
    { icon: Globe, key: 'trust3' },
    { icon: AlertCircle, key: 'trust4' },
  ] as const;

  return (
    <section
      className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,132,17,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'rgba(255,132,17,0.1)',
              color: '#FF8411',
              border: '1px solid rgba(255,132,17,0.2)',
            }}
          >
            {t('badge')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-6"
          style={{ color: '#f5f5f5' }}
        >
          {t('headline')}
        </h1>

        {/* Subheadline */}
        <p
          className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: '#a1a1aa' }}
        >
          {t('subheadline')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto justify-center bg-[#FF8411] text-white hover:bg-[#e87510]"
          >
            {t('ctaPrimary')}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto justify-center text-zinc-100 border border-[#2a2a2a] hover:bg-[#111111] hover:border-[#3f3f46]"
          >
            {t('ctaSecondary')}
          </Link>
        </div>

        {/* Trust points */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
          {trustPoints.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon size={14} style={{ color: '#FF8411' }} />
              <span className="text-sm" style={{ color: '#71717a' }}>
                {t(key)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: '1px solid #1f1f1f',
            backgroundColor: '#0d0d0d',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid #1a1a1a' }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2a2a2a' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2a2a2a' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2a2a2a' }} />
            </div>
            <div
              className="flex-1 h-5 rounded mx-4"
              style={{ backgroundColor: '#1a1a1a', maxWidth: '220px', margin: '0 auto' }}
            />
          </div>

          {/* Mockup content */}
          <div className="p-6 grid grid-cols-3 gap-4">
            {/* Stat cards */}
            {[
              { label: 'Trust Score', value: '94', accent: true },
              { label: 'Checkout Clarity', value: '87' },
              { label: 'Mobile Score', value: '92' },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#111111',
                  border: card.accent
                    ? '1px solid rgba(255,132,17,0.2)'
                    : '1px solid #1a1a1a',
                }}
              >
                <div
                  className="text-xs mb-1"
                  style={{ color: '#52525b' }}
                >
                  {card.label}
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: card.accent ? '#FF8411' : '#f5f5f5' }}
                >
                  {card.value}
                  <span className="text-sm font-normal ms-0.5">%</span>
                </div>
                {/* Mini bar */}
                <div
                  className="mt-2 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#1a1a1a' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${card.value}%`,
                      backgroundColor: card.accent ? '#FF8411' : '#3f3f46',
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Checklist */}
            <div
              className="col-span-3 rounded-lg p-4"
              style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}
            >
              <div className="text-xs mb-3" style={{ color: '#52525b' }}>
                Audit checklist
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Professional design',
                  'Clear checkout',
                  'Trust signals',
                  'Mobile ready',
                  'Policy pages',
                  'Fast load speed',
                  'Contact info',
                  'Clear pricing',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(255,132,17,0.15)' }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="#FF8411"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs" style={{ color: '#71717a' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
