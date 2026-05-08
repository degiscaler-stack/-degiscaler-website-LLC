import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Layout,
  ShoppingCart,
  Zap,
  Search,
  Eye,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

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

export default function ServicesSection() {
  const t = useTranslations('home.services');

  return (
    <section
      className="py-20 lg:py-28"
      style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#FF8411' }}
          >
            {t('sectionLabel')}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h2>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{ color: '#71717a' }}
          >
            {t('subheadline')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceKeys.map((key) => {
            const Icon = serviceIcons[key];
            return (
              <div
                key={key}
                className="rounded-xl p-6 flex flex-col gap-4 transition-colors duration-200 bg-[#111111] border border-[#1a1a1a] hover:border-[#FF8411]/20"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255,132,17,0.1)',
                  }}
                >
                  <Icon size={20} style={{ color: '#FF8411' }} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: '#f5f5f5' }}
                  >
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
                    {t(`items.${key}.description`)}
                  </p>
                </div>

                {/* Outcome */}
                <div
                  className="flex items-start gap-2 pt-3"
                  style={{ borderTop: '1px solid #1a1a1a' }}
                >
                  <div
                    className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: '#FF8411' }}
                  />
                  <p className="text-xs" style={{ color: '#a1a1aa' }}>
                    {t(`items.${key}.outcome`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-[#FF8411] hover:text-white"
          >
            {t('viewAll')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
