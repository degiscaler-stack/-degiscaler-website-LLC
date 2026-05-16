import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Download } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import { resolvePackageForOrder } from '@/lib/packages/public-packages';
import {
  canonicalPublicSlug,
  isOrderablePackageSlug,
  productZipFilename,
} from '@/lib/packages/map-slug';
import {
  cardSurfaceBgImage,
  cardTopHighlight,
  contentMax,
  ds,
  pageMainTopClass,
  primaryBtnClass,
  secondaryBtnClass,
  sectionPad,
} from '@/components/home/homeTheme';

function safePricingPackages(tPricing: { raw: (key: string) => unknown }): Array<{
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}> {
  try {
    const raw = tPricing.raw('packages');
    return Array.isArray(raw) ? (raw as never) : [];
  } catch {
    return [];
  }
}

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; pkg?: string }>;
}) {
  const { locale } = await params;
  const q = await searchParams;
  const type = typeof q.type === 'string' ? q.type.trim() : '';
  const pkgRaw = typeof q.pkg === 'string' ? q.pkg.trim() : '';

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'thankYouPage' });

  let fallbackPackages: ReturnType<typeof safePricingPackages> = [];
  try {
    const tPrice = await getTranslations({ locale, namespace: 'pricingPage' });
    fallbackPackages = safePricingPackages(tPrice);
  } catch (err) {
    console.error('[ThankYouPage] pricing translations', err);
  }

  const isContact = type === 'contact';
  const isOrder = type === 'order';
  const hasValidPkg = Boolean(pkgRaw && isOrderablePackageSlug(pkgRaw));

  let productTitle: string | null = null;
  let zipHref: string | null = null;

  if (hasValidPkg) {
    try {
      const resolved = await resolvePackageForOrder(pkgRaw, fallbackPackages);
      productTitle = resolved?.packageTitle ?? null;
      const z = productZipFilename(canonicalPublicSlug(pkgRaw));
      zipHref = z ? `/downloads/${z}` : null;
    } catch (err) {
      console.error('[ThankYouPage] resolve package', err);
    }
  }

  const showAwaitingConfirmation = !isContact && (!isOrder || !hasValidPkg);
  const showOrderKitAccess = isOrder && hasValidPkg;
  const showDownloadButton = showOrderKitAccess && Boolean(zipHref);

  const heroTitle = isContact ? t('contactTitle') : t('orderTitle');
  const heroSubtitle = isContact
    ? t('contactBody')
    : showAwaitingConfirmation
      ? t('awaitingCheckoutBody')
      : t('orderConfirmationSubtitle');

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero
          eyebrow={
            <span className="logo-brand-isolate inline-block normal-case tracking-normal" lang="en">
              DigiScaler
            </span>
          }
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section className={sectionPad} style={{ backgroundColor: ds.bgAlt }}>
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax} space-y-8`}>
          {showAwaitingConfirmation ? (
            <div className="flex max-w-[40rem] flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/pricing"
                className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
              >
                {t('backToPricing')}
              </Link>
              <Link
                href="/"
                className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
              >
                {t('backHome')}
              </Link>
            </div>
          ) : null}

          {isContact ? (
            <Link
              href="/"
              className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
            >
              {t('backHome')}
            </Link>
          ) : null}

          {showOrderKitAccess ? (
            <div
              className="rounded-2xl md:rounded-[1.4rem] p-8 md:p-10 max-w-[40rem]"
              style={{
                border: `1px solid ${ds.borderStrong}`,
                backgroundImage: cardSurfaceBgImage,
                backgroundColor: ds.cardElevated,
                boxShadow: `${cardTopHighlight}, 0 20px 52px rgba(0,0,0,0.38)`,
              }}
            >
              {productTitle ? (
                <p className="text-[1.125rem] md:text-[1.2rem] font-bold tracking-tight" style={{ color: ds.text }}>
                  {productTitle}
                </p>
              ) : null}
              <p className="text-[14px] md:text-[15px] leading-[1.75] mt-5" style={{ color: ds.textSecondary }}>
                {t('filesAvailableBelow')}
              </p>

              {showDownloadButton ? (
                <a
                  href={zipHref!}
                  download
                  className={`${primaryBtnClass} mt-6 inline-flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl text-[15px] font-semibold no-underline`}
                >
                  <Download size={18} strokeWidth={2} aria-hidden />
                  {t('downloadKitZip')}
                </a>
              ) : (
                <p className="mt-6 text-[13px] md:text-[14px] leading-relaxed" style={{ color: ds.textMuted }}>
                  {t('fulfillmentFollowUp')}
                </p>
              )}

              <p className="text-[14px] md:text-[15px] leading-[1.75] mt-6" style={{ color: ds.textSecondary }}>
                {t('saveSecurelyShort')}
              </p>

              <p className="text-[12px] md:text-[13px] leading-relaxed mt-4" style={{ color: ds.textMuted }}>
                {t('digitalFulfillmentShort')}
              </p>

              <p
                className="text-[14px] md:text-[15px] leading-relaxed mt-8 pt-8 border-t"
                style={{ borderColor: ds.border, color: ds.textMuted }}
              >
                {t('supportIntro')}{' '}
                <a
                  href="mailto:support@degiscaler.com"
                  className="font-semibold underline underline-offset-4 hover:opacity-90"
                  style={{ color: '#e8cc65' }}
                >
                  support@degiscaler.com
                </a>
              </p>
            </div>
          ) : null}

          {showOrderKitAccess ? (
            <Link
              href="/"
              className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
            >
              {t('backHome')}
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
