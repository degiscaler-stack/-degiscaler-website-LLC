export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

/** Safe slug to submit when DB/fallback resolution fails (preserves visitor intent). */
function harmlessSlugCandidate(raw: string): string | null {
  const t = raw.trim().toLowerCase().slice(0, 120);
  if (!t || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)) return null;
  return t;
}

const ORDER_COPY_FALLBACK = {
  title: 'Complete your request',
  subtitle: 'Tell us how to reach you. We will confirm your package and next steps.',
  fallbackSummaryTitle: 'Project request',
  fallbackSummaryDescription:
    'Tell us what you need. Our team will follow up with options and next steps.',
  fallbackPackageNotice:
    'Live package details could not be loaded right now. Your request will still be submitted safely.',
  genericRequestHint:
    'Browse Pricing for consultation tiers, or send a general project request below.',
};

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

  try {
    setRequestLocale(locale);
  } catch (err) {
    console.error('[OrderPage] setRequestLocale', err);
  }

  let orderCopy = { ...ORDER_COPY_FALLBACK };
  let pricingTitle = 'Pricing';
  let fallbackPackages: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }> = [];

  try {
    const tOrd = await getTranslations({ locale, namespace: 'orderPage' });
    const tPrice = await getTranslations({ locale, namespace: 'pricingPage' });
    orderCopy = {
      title: tOrd('title'),
      subtitle: tOrd('subtitle'),
      fallbackSummaryTitle: tOrd('fallbackSummaryTitle'),
      fallbackSummaryDescription: tOrd('fallbackSummaryDescription'),
      fallbackPackageNotice: tOrd('fallbackPackageNotice'),
      genericRequestHint: tOrd('genericRequestHint'),
    };
    pricingTitle = tPrice('title');
    fallbackPackages = safePricingPackages(tPrice);
  } catch (err) {
    console.error('[OrderPage] getTranslations', err);
  }

  let resolved: Awaited<ReturnType<typeof resolvePackageForOrder>> = null;
  try {
    if (pkgParam && isOrderableConsultationSlug(pkgParam)) {
      resolved = await resolvePackageForOrder(pkgParam, fallbackPackages);
    }
  } catch (err) {
    console.error('[OrderPage] resolvePackageForOrder', err);
    resolved = null;
  }

  const slugCandidate =
    pkgParam && isOrderableConsultationSlug(pkgParam) ? harmlessSlugCandidate(pkgParam) : null;

  const display = resolved
    ? {
        packageSlug: resolved.packageSlug as string | null,
        packageTitle: resolved.packageTitle,
        packagePrice: resolved.packagePrice as string | null,
        currency: resolved.currency as string | null,
        description: resolved.description,
        usesFallbackSummary: false,
      }
    : {
        packageSlug: slugCandidate,
        packageTitle: orderCopy.fallbackSummaryTitle,
        packagePrice: null as string | null,
        currency: null as string | null,
        description: orderCopy.fallbackSummaryDescription,
        usesFallbackSummary: true,
      };

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero eyebrow="DegiScaler" title={orderCopy.title} subtitle={orderCopy.subtitle} />
      </section>

      <section
        className={sectionPad}
        style={{
          backgroundColor: ds.bgAlt,
          borderTop: `1px solid ${ds.borderStrong}`,
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <div className="max-w-[640px] space-y-6">
            {display.usesFallbackSummary && pkgParam && isOrderableConsultationSlug(pkgParam) ? (
              <p className="text-[13px] leading-relaxed text-amber-100/90">
                {orderCopy.fallbackPackageNotice}
              </p>
            ) : null}
            {display.usesFallbackSummary && (!pkgParam || !isOrderableConsultationSlug(pkgParam)) ? (
              <p className="text-[13px] leading-relaxed" style={{ color: ds.textMuted }}>
                {orderCopy.genericRequestHint}
              </p>
            ) : null}

            <OrderFormClient locale={locale} display={display} />

            <Link
              href="/pricing"
              className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
            >
              {pricingTitle}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
