import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Clock } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { ds } from '@/components/home/homeTheme';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer
      style={{
        backgroundColor: ds.bgAlt,
        borderTop: `1px solid ${ds.borderStrong}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-[4.75rem] md:py-24 lg:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-16 xl:gap-20">
          <div className="lg:col-span-1">
            <div className="mb-7">
              <BrandLogo />
            </div>
            <p className="text-[15.5px] md:text-[1.02rem] leading-[1.72] max-w-[24rem]" style={{ color: ds.textSecondary }}>
              {t('tagline')}
            </p>
          </div>

          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-7"
              style={{ color: ds.textMuted }}
            >
              {t('company')}
            </h3>
            <ul className="space-y-5">
              {(['services', 'pricing', 'about', 'contact', 'faq'] as const).map((key) => (
                <li key={key}>
                  <Link href={`/${key}`} className="text-[15.5px] transition-colors hover:text-[#e8cc65]" style={{ color: ds.textSecondary }}>
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-7"
              style={{ color: ds.textMuted }}
            >
              {t('legal')}
            </h3>
            <ul className="space-y-5">
              {(
                [
                  ['privacy', '/privacy-policy'],
                  ['terms', '/terms-of-service'],
                  ['refund', '/refund-policy'],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link href={href} className="text-[15.5px] transition-colors hover:text-[#e8cc65]" style={{ color: ds.textSecondary }}>
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-7"
              style={{ color: ds.textMuted }}
            >
              {t('contactTitle')}
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="icon-box-premium icon-box-premium--sm icon-box-premium--glyph icon-footer-well flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-0 sm:h-[32px] sm:w-[32px]">
                  <Mail size={16} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
                </div>
                <div className="pt-1">
                  <a
                    href="mailto:support@degiscaler.com"
                    className="text-[15.5px] transition-colors hover:text-[#e8cc65]"
                    style={{ color: ds.textSecondary }}
                  >
                    {t('supportEmail')}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="icon-box-premium icon-box-premium--sm icon-box-premium--glyph icon-footer-well flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-0 sm:h-[32px] sm:w-[32px]">
                  <Clock size={16} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
                </div>
                <span className="text-[15.5px] leading-relaxed pt-1 max-w-[16rem]" style={{ color: ds.textMuted }}>
                  {t('responseTime')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-16 md:mt-20 pt-11 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
          style={{ borderTop: `1px solid ${ds.border}` }}
        >
          <p className="text-[13.5px] leading-relaxed" style={{ color: ds.textMuted }} suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
          <p className="text-[13px] md:text-[13.5px] max-w-2xl leading-[1.7]" style={{ color: ds.textMuted, opacity: 0.92 }}>
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}