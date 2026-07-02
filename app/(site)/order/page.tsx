export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import OrderFormClient from '@/components/order/OrderFormClient';
import { resolvePackageForOrder } from '@/lib/packages/public-packages';
import {
  canonicalPackageSlug,
  isOrderablePackageSlug,
  publicPackageSlug,
} from '@/lib/packages/map-slug';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  secondaryBtnClass,
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
  title: 'Secure checkout',
  subtitle:
    'Review your selected digital kit and complete your order securely. Download access is shown only after checkout is completed.',
  fallbackSummaryTitle: 'Purchase assistance',
  fallbackSummaryDescription:
    'Tell us which kit you wanted. Our team will follow up with access instructions.',
  genericRequestHint: 'Choose a kit from Pricing to see your order summary here.',
  backToPricing: 'Back to pricing',
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const q = await searchParams;
  const pkgParam = typeof q.package === 'string' ? q.package.trim() : '';


  let orderCopy = { ...ORDER_COPY_FALLBACK };
  let fallbackPackages: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }> = [];

  try {
    const tOrd = await getTranslations('orderPage');
    const tPrice = await getTranslations('pricingPage');
    orderCopy = {
      title: tOrd('title'),
      subtitle: tOrd('subtitle'),
      fallbackSummaryTitle: tOrd('fallbackSummaryTitle'),
      fallbackSummaryDescription: tOrd('fallbackSummaryDescription'),
      genericRequestHint: tOrd('genericRequestHint'),
      backToPricing: tOrd('backToPricing'),
    };
    fallbackPackages = safePricingPackages(tPrice);
  } catch (err) {
    console.error('[OrderPage] getTranslations', err);
  }

  const pkgCanon = pkgParam ? canonicalPackageSlug(pkgParam) : '';

  let resolved: Awaited<ReturnType<typeof resolvePackageForOrder>> = null;
  try {
    if (pkgParam && isOrderablePackageSlug(pkgParam)) {
      resolved = await resolvePackageForOrder(pkgParam, fallbackPackages);
    }
  } catch (err) {
    console.error('[OrderPage] resolvePackageForOrder', err);
    resolved = null;
  }

  const slugCandidate =
    pkgCanon && isOrderablePackageSlug(pkgCanon)
      ? harmlessSlugCandidate(publicPackageSlug(pkgCanon))
      : null;

  const display = resolved
    ? {
        packageSlug: resolved.packageSlug,
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
        <PageHero
          eyebrow={
            <span className="logo-brand-isolate inline-block normal-case tracking-normal" lang="en">
              DigiScaler
            </span>
          }
          title={orderCopy.title}
          subtitle={orderCopy.subtitle}
        />
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
            {display.usesFallbackSummary ? (
              <p className="text-[13px] leading-relaxed" style={{ color: ds.textMuted }}>
                {orderCopy.genericRequestHint}
              </p>
            ) : null}

            <OrderFormClient display={display} />

            <Link
              href="/pricing"
              className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
            >
              {orderCopy.backToPricing}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
