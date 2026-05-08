import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Building2, ShieldOff, MessageSquare, Target, ArrowRight } from 'lucide-react';

const valueIcons = [Building2, ShieldOff, MessageSquare, Target];

type Value = { title: string; description: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('aboutPage');
  const values: Value[] = t.raw('values') as Value[];

  return (
    <div className="pt-24">
      {/* Header */}
      <div
        className="py-16 lg:py-20"
        style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h1>
          <p className="text-base lg:text-lg" style={{ color: '#71717a' }}>
            {t('subheadline')}
          </p>
        </div>
      </div>

      <div className="py-16 lg:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Mission */}
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#FF8411' }}
            >
              {t('missionLabel')}
            </span>
            <p className="text-base leading-relaxed" style={{ color: '#a1a1aa' }}>
              {t('missionText')}
            </p>
          </div>

          {/* What we do */}
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#FF8411' }}
            >
              {t('whatWeDoLabel')}
            </span>
            <p className="text-base leading-relaxed" style={{ color: '#a1a1aa' }}>
              {t('whatWeDoText')}
            </p>
          </div>

          {/* Values */}
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: '#FF8411' }}
            >
              {t('valuesLabel')}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((val, i) => {
                const Icon = valueIcons[i] ?? Building2;
                return (
                  <div
                    key={i}
                    className="rounded-xl p-5 flex gap-4"
                    style={{
                      backgroundColor: '#0d0d0d',
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(255,132,17,0.08)' }}
                    >
                      <Icon size={16} style={{ color: '#FF8411' }} />
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-1"
                        style={{ color: '#f5f5f5' }}
                      >
                        {val.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Company details */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: '#0d0d0d',
              border: '1px solid #1a1a1a',
            }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: '#52525b' }}
            >
              {t('companyDetails.label')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                ['name', 'type', 'focus', 'email'] as const
              ).map((key) => (
                <div key={key}>
                  <span
                    className="block text-xs mb-0.5"
                    style={{ color: '#52525b' }}
                  >
                    {t(`companyDetails.${key}Label`)}
                  </span>
                  <span className="text-sm" style={{ color: '#a1a1aa' }}>
                    {t(`companyDetails.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="py-14"
        style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
      >
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors bg-[#FF8411] text-white hover:bg-[#e87510]"
          >
            {t('contactCta')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
