import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Check, Star } from 'lucide-react';

type Package = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
};

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingContent />;
}

function PricingContent() {
  const t = useTranslations('pricingPage');
  const packages: Package[] = t.raw('packages') as Package[];

  const row1 = packages.slice(0, 3);
  const row2 = packages.slice(3);

  return (
    <div className="pt-24">
      {/* Header */}
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

      {/* Pricing cards */}
      <div className="py-16 lg:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row 1: first 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
            {row1.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} t={t} />
            ))}
          </div>

          {/* Row 2: last 2 centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {row2.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} t={t} />
            ))}
          </div>

          {/* Disclaimer */}
          <p
            className="text-xs text-center mt-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#52525b' }}
          >
            {t('disclaimer')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div
        className="py-14"
        style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p
            className="text-base font-medium mb-5"
            style={{ color: '#a1a1aa' }}
          >
            {t('ctaHeadline')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors bg-[#FF8411] text-white hover:bg-[#e87510]"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  pkg,
  t,
}: {
  pkg: Package;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col relative"
      style={{
        backgroundColor: pkg.highlighted ? '#111111' : '#0d0d0d',
        border: pkg.highlighted
          ? '1px solid rgba(255,132,17,0.35)'
          : '1px solid #1a1a1a',
      }}
    >
      {/* Elite badge */}
      {pkg.highlighted && (
        <div className="flex items-center gap-1.5 mb-4">
          <Star size={12} style={{ color: '#FF8411' }} />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#FF8411' }}
          >
            {t('mostPopular')}
          </span>
        </div>
      )}

      {/* Name & price */}
      <div className="mb-4">
        <h2
          className="text-base font-semibold mb-1"
          style={{ color: '#f5f5f5' }}
        >
          {pkg.name}
        </h2>
        <div className="flex items-baseline gap-1 mb-2">
          <span
            className="text-3xl font-bold"
            style={{ color: pkg.highlighted ? '#FF8411' : '#f5f5f5' }}
          >
            {pkg.price}
          </span>
          <span className="text-xs" style={{ color: '#52525b' }}>
            / {t('perPackage')}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
          {pkg.description}
        </p>
      </div>

      {/* Divider */}
      <div
        className="h-px mb-4"
        style={{
          backgroundColor: pkg.highlighted
            ? 'rgba(255,132,17,0.15)'
            : '#1a1a1a',
        }}
      />

      {/* Features */}
      <ul className="space-y-2.5 flex-1 mb-6">
        {pkg.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5">
            <Check
              size={14}
              className="mt-0.5 shrink-0"
              style={{ color: pkg.highlighted ? '#FF8411' : '#52525b' }}
            />
            <span className="text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>
              {feat}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/contact"
        className={
          pkg.highlighted
            ? 'block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors bg-[#FF8411] text-white hover:bg-[#e87510]'
            : 'block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors border border-[#2a2a2a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-zinc-100'
        }
      >
        {t('getStarted')}
      </Link>
    </div>
  );
}
