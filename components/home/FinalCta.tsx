import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export default function FinalCta() {
  const t = useTranslations('home.cta');

  return (
    <section
      className="py-20 lg:py-24"
      style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="w-12 h-1 rounded-full mx-auto mb-8"
          style={{ backgroundColor: '#FF8411' }}
        />

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
          style={{ color: '#f5f5f5' }}
        >
          {t('headline')}
        </h2>
        <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: '#71717a' }}>
          {t('subheadline')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto justify-center bg-[#FF8411] text-white hover:bg-[#e87510]"
          >
            {t('ctaPrimary')}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto justify-center border border-[#2a2a2a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-zinc-100"
          >
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
