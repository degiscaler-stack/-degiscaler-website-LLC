'use server';

import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { isValidEmail } from '@/lib/validation/email';
import { resolvePackageForOrder } from '@/lib/packages/public-packages';
import { safeCreateOrder } from '@/lib/db/public-safe';

const FALLBACK_ORDER_SLUG = 'project-request';

function sanitizeOrderSlug(raw: string): string {
  const t = raw.trim().toLowerCase().slice(0, 120);
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)) return t;
  return FALLBACK_ORDER_SLUG;
}

export type OrderActionState = { error: string | null; ok?: boolean; redirectTo?: string };

function safePricingFallbackPackages(
  tPricing: { raw: (key: string) => unknown },
): Array<{
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

export async function submitOrderAction(
  _prev: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const localeRaw = String(formData.get('locale') ?? '').trim().toLowerCase();
  const locale = routing.locales.includes(localeRaw as (typeof routing.locales)[number])
    ? localeRaw
    : routing.defaultLocale;

  const pkgSlugRaw = String(formData.get('packageSlug') ?? '').trim();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const whatsapp = String(formData.get('whatsapp') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim() || null;

  const snapTitle = String(formData.get('packageTitleSnapshot') ?? '').trim().slice(0, 200);
  const snapPrice = String(formData.get('packagePriceSnapshot') ?? '').trim().slice(0, 80);
  const snapCurrency = String(formData.get('packageCurrencySnapshot') ?? '').trim().slice(0, 16);
  const snapDesc = String(formData.get('packageDescriptionSnapshot') ?? '').trim().slice(0, 4000);

  const tErrLookup: Record<string, string> = {
    required: 'Please fill in all required fields.',
    email: 'Please enter a valid email address.',
    package: 'Selected package is not available.',
    server: 'Something went wrong. Please try again shortly.',
  };
  let tErr = (k: string) => tErrLookup[k] ?? k;
  try {
    const gt = await getTranslations({ locale, namespace: 'orderPage.errors' });
    tErr = (k: string) => gt(k as never);
  } catch (err) {
    console.error('[submitOrderAction] getTranslations errors', err);
  }

  if (!fullName || !email) {
    return { error: tErr('required') };
  }
  if (!isValidEmail(email)) {
    return { error: tErr('email') };
  }

  let fallbackPackages: ReturnType<typeof safePricingFallbackPackages> = [];
  try {
    const tPricing = await getTranslations({ locale, namespace: 'pricingPage' });
    fallbackPackages = safePricingFallbackPackages(tPricing);
  } catch (err) {
    console.error('[submitOrderAction] pricing translations', err);
  }

  let packageSlug = pkgSlugRaw || FALLBACK_ORDER_SLUG;
  let packageTitle = snapTitle;
  let packagePrice = snapPrice || '—';
  let currency = snapCurrency || 'USD';
  let descriptionSnapshot = snapDesc;
  let packageId: string | null = null;

  if (pkgSlugRaw) {
    const resolved = await resolvePackageForOrder(pkgSlugRaw, fallbackPackages);
    if (resolved) {
      packageId = resolved.packageId;
      packageSlug = resolved.packageSlug;
      packageTitle = resolved.packageTitle;
      packagePrice = resolved.packagePrice;
      currency = resolved.currency;
      descriptionSnapshot = resolved.description;
    } else {
      packageSlug = sanitizeOrderSlug(pkgSlugRaw);
      if (!packageTitle) {
        try {
          const tOrder = await getTranslations({ locale, namespace: 'orderPage' });
          packageTitle = tOrder('fallbackSummaryTitle');
        } catch {
          packageTitle = 'Project request';
        }
      }
      if (!descriptionSnapshot) {
        try {
          const tOrder = await getTranslations({ locale, namespace: 'orderPage' });
          descriptionSnapshot = tOrder('fallbackSummaryDescription');
        } catch {
          descriptionSnapshot =
            'Tell us what you need. Our team will follow up with options and next steps.';
        }
      }
      if (!snapPrice) packagePrice = '—';
      if (!snapCurrency) currency = 'USD';
    }
  } else {
    if (!packageTitle) {
      try {
        const tOrder = await getTranslations({ locale, namespace: 'orderPage' });
        packageTitle = tOrder('fallbackSummaryTitle');
      } catch {
        packageTitle = 'Project request';
      }
    }
    if (!descriptionSnapshot) {
      try {
        const tOrder = await getTranslations({ locale, namespace: 'orderPage' });
        descriptionSnapshot = tOrder('fallbackSummaryDescription');
      } catch {
        descriptionSnapshot =
          'Tell us what you need. Our team will follow up with options and next steps.';
      }
    }
    packageSlug = FALLBACK_ORDER_SLUG;
    if (!snapPrice) packagePrice = '—';
    if (!snapCurrency) currency = 'USD';
  }

  const insertPayload = {
    ...(packageId ? { packageId } : {}),
    packageSlug,
    packageTitle: packageTitle || 'Project request',
    packagePrice: packagePrice || '—',
    fullName,
    email,
    whatsapp,
    message,
    status: 'NEW' as const,
    locale,
  };

  const result = await safeCreateOrder(insertPayload);
  if (!result.ok) {
    return { error: tErr('server') };
  }

  return {
    error: null,
    ok: true,
    redirectTo: `/${locale}/thank-you?type=order`,
  };
}

export const orderInitialActionState: OrderActionState = { error: null };
