'use server';

import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';
import { isValidEmail } from '@/lib/validation/email';
import { resolvePackageForOrder } from '@/lib/packages/public-packages';
import { isOrderableConsultationSlug } from '@/lib/packages/map-slug';

export type OrderActionState = { error: string | null };

export async function submitOrderAction(
  _prev: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const localeRaw = String(formData.get('locale') ?? '').trim().toLowerCase();
  const locale = routing.locales.includes(localeRaw as (typeof routing.locales)[number])
    ? localeRaw
    : routing.defaultLocale;

  const pkgSlug = String(formData.get('packageSlug') ?? '').trim();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const whatsapp = String(formData.get('whatsapp') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim() || null;

  const tErr = await getTranslations({ locale, namespace: 'orderPage.errors' });

  if (!fullName || !email) {
    return { error: tErr('required') };
  }
  if (!isValidEmail(email)) {
    return { error: tErr('email') };
  }
  if (!isOrderableConsultationSlug(pkgSlug)) {
    return { error: tErr('package') };
  }

  const tPricing = await getTranslations({ locale, namespace: 'pricingPage' });
  const fallbackPackages = tPricing.raw('packages') as Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;

  const resolved = await resolvePackageForOrder(pkgSlug, fallbackPackages);
  if (!resolved) {
    return { error: tErr('package') };
  }

  try {
    await prisma.order.create({
      data: {
        packageId: resolved.packageId,
        packageSlug: resolved.packageSlug,
        packageTitle: resolved.packageTitle,
        packagePrice: resolved.packagePrice,
        fullName,
        email,
        whatsapp,
        message,
        status: 'NEW',
        locale,
      },
    });
  } catch {
    return { error: tErr('server') };
  }

  redirect(`/${locale}/thank-you?type=order`);
}

export const orderInitialActionState: OrderActionState = { error: null };
