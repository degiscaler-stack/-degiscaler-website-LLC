import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, ArrowRight } from 'lucide-react';

type Package = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
};

export default function HomePricing() {
  const sectionT = useTranslations('home.pricing');
  const packages: Package[] = useTranslations('pricingPage').raw(
    'packages'
  ) as Package[];

  // Show first 3 on homepage
  const preview = packages.slice(0, 3);

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#FF8411' }}
          >
            {sectionT('sectionLabel')}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: '#f5f5f5' }}
          >
            {sectionT('headline')}
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: '#71717a' }}>
            {sectionT('subheadline')}
          </p>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {preview.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-xl p-6 flex flex-col"
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1a1a1a',
              }}
            >
              <div className="mb-4">
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: '#f5f5f5' }}
                >
                  {pkg.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: '#FF8411' }}
                  >
                    {pkg.price}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{ color: '#FF8411' }}
                    />
                    <span className="text-xs" style={{ color: '#71717a' }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="block w-full text-center py-2 rounded-md text-xs font-semibold transition-colors bg-[#FF8411]/10 text-[#FF8411] border border-[#FF8411]/20 hover:bg-[#FF8411] hover:text-white"
              >
                {sectionT('getStarted')}
              </Link>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-[#FF8411] hover:text-white"
          >
            {sectionT('viewAll')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
