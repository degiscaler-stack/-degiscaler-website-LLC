import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/layout/PageHero';
import OrderFormClient from '@/components/order/OrderFormClient';
import { resolvePackageForOrder } from '@/lib/packages/public-packages';
import { isOrderableConsultationSlug } from '@/lib/packages/map-slug';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  primaryBtnClass,
} from '@/components/home/homeTheme';

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ package?: string }>;
}) {
  const { locale } = await params;
  const q = await searchParams;
  const pkgParam = typeof q.package === 'string' ? q.package.trim() : '';

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'orderPage' });
  const tPricing = await getTranslations({ locale, namespace: 'pricingPage' });
  const fallbackPackages = tPricing.raw('packages') as Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;

  const resolved =
    pkgParam && isOrderableConsultationSlug(pkgParam)
      ? await resolvePackageForOrder(pkgParam, fallbackPackages)
      : null;

  const valid = Boolean(resolved && isOrderableConsultationSlug(pkgParam));

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero eyebrow="DegiScaler" title={t('title')} subtitle={t('subtitle')} />
      </section>

      <section
        className={sectionPad}
        style={{
          backgroundColor: ds.bgAlt,
          borderTop: `1px solid ${ds.borderStrong}`,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          {!valid ? (
            <div className="max-w-xl space-y-6">
              <p className="text-[15px] leading-relaxed" style={{ color: ds.textMuted }}>
                {t('unknownPackage')}
              </p>
              <Link
                href="/pricing"
                className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
              >
                {tPricing('title')}
              </Link>
            </div>
          ) : (
            <OrderFormClient locale={locale} packageSlug={pkgParam} resolved={resolved!} />
          )}
        </div>
      </section>
    </div>
  );
}
