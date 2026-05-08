import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Clock } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#080808',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-lg font-bold" style={{ color: '#FF8411' }}>
                Degi
              </span>
              <span className="text-lg font-bold text-white">Scaler</span>
              <span className="text-xs ms-1" style={{ color: '#52525b' }}>
                LLC
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
              {t('tagline')}
            </p>
          </div>

          {/* Company links */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#a1a1aa' }}
            >
              {t('company')}
            </h3>
            <ul className="space-y-2.5">
              {(['services', 'pricing', 'about', 'contact', 'faq'] as const).map(
                (key) => (
                  <li key={key}>
                    <Link
                      href={`/${key}`}
                      className="text-sm transition-colors text-[#71717a] hover:text-zinc-100"
                    >
                      {t(`links.${key}`)}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#a1a1aa' }}
            >
              {t('legal')}
            </h3>
            <ul className="space-y-2.5">
              {(
                [
                  ['privacy', '/privacy-policy'],
                  ['terms', '/terms-of-service'],
                  ['refund', '/refund-policy'],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm transition-colors text-[#71717a] hover:text-zinc-100"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#a1a1aa' }}
            >
              {t('contactTitle')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0" style={{ color: '#FF8411' }} />
                <a
                  href="mailto:support@degiscaler.com"
                  className="text-sm transition-colors text-[#71717a] hover:text-[#FF8411]"
                >
                  {t('supportEmail')}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 shrink-0" style={{ color: '#71717a' }} />
                <span className="text-sm" style={{ color: '#52525b' }}>
                  {t('responseTime')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid #1a1a1a' }}
        >
          <p className="text-xs" style={{ color: '#52525b' }}>
            &copy; {year} {t('copyright')}
          </p>
          <p
            className="text-xs max-w-lg leading-relaxed"
            style={{ color: '#3f3f46' }}
          >
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
