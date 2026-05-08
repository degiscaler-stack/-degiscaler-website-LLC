import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Check, Layout, ShoppingCart, Zap, Search, Eye, MessageSquare, ArrowRight } from 'lucide-react';

const serviceIcons = {
  websiteDesign: Layout,
  ecommerce: ShoppingCart,
  landingPage: Zap,
  audit: Search,
  uiux: Eye,
  consultation: MessageSquare,
};

const serviceKeys = [
  'websiteDesign',
  'ecommerce',
  'landingPage',
  'audit',
  'uiux',
  'consultation',
] as const;

type ServiceData = {
  title: string;
  description: string;
  outcomes: string[];
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations('servicesPage');

  return (
    <div className="pt-24">
      {/* Page header */}
      <div
        className="py-16 lg:py-20"
        style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h1>
          <p className="text-base lg:text-lg max-w-2xl mx-auto" style={{ color: '#71717a' }}>
            {t('subheadline')}
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="py-16 lg:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {serviceKeys.map((key) => {
              const Icon = serviceIcons[key];
              const service = t.raw(`services.${key}`) as ServiceData;
              return (
                <div
                  key={key}
                  className="rounded-xl p-6 lg:p-8"
                  style={{
                    backgroundColor: '#0d0d0d',
                    border: '1px solid #1a1a1a',
                  }}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Icon */}
                    <div className="shrink-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,132,17,0.1)' }}
                      >
                        <Icon size={22} style={{ color: '#FF8411' }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2
                        className="text-lg font-semibold mb-3"
                        style={{ color: '#f5f5f5' }}
                      >
                        {service.title}
                      </h2>
                      <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: '#71717a' }}
                      >
                        {service.description}
                      </p>

                      <div
                        className="pt-4"
                        style={{ borderTop: '1px solid #1a1a1a' }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-3"
                          style={{ color: '#52525b' }}
                        >
                          {t('whatYouGet')}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.outcomes.map((outcome) => (
                            <li
                              key={outcome}
                              className="flex items-start gap-2"
                            >
                              <Check
                                size={14}
                                className="mt-0.5 shrink-0"
                                style={{ color: '#FF8411' }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: '#a1a1aa' }}
                              >
                                {outcome}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="py-16"
        style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-xl sm:text-2xl font-bold mb-3"
            style={{ color: '#f5f5f5' }}
          >
            {t('ctaHeadline')}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#71717a' }}>
            {t('ctaSubheadline')}
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors bg-[#FF8411] text-white hover:bg-[#e87510]"
          >
            {t('ctaButton')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
