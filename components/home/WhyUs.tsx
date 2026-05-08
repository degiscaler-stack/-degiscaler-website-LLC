import { useTranslations } from 'next-intl';
import {
  Building2,
  Package,
  CreditCard,
  MessageSquare,
  Eye,
  ShieldOff,
} from 'lucide-react';

const icons = [Building2, Package, CreditCard, MessageSquare, Eye, ShieldOff];

export default function WhyUs() {
  const t = useTranslations('home.whyUs');
  const items: { title: string; description: string }[] = t.raw('items') as {
    title: string;
    description: string;
  }[];

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#0a0a0a' }}>
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
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i] ?? Building2;
            return (
              <div
                key={i}
                className="rounded-xl p-6 flex flex-col gap-3"
                style={{
                  backgroundColor: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,132,17,0.08)' }}
                  >
                    <Icon size={16} style={{ color: '#FF8411' }} />
                  </div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: '#f5f5f5' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
