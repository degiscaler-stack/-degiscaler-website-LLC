'use server';

import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';
import { isValidEmail } from '@/lib/validation/email';

export type ContactActionState = { error: string | null; ok?: boolean; redirectTo?: string };

export async function submitContactAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const localeRaw = String(formData.get('locale') ?? '').trim().toLowerCase();
  const locale = routing.locales.includes(localeRaw as (typeof routing.locales)[number])
    ? localeRaw
    : routing.defaultLocale;

  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const budgetOrPackage = String(formData.get('budgetOrPackage') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim();

  const tErr = await getTranslations({ locale, namespace: 'contactPage.errors' });

  if (!fullName || !email || !message) {
    return { error: tErr('required') };
  }
  if (!isValidEmail(email)) {
    return { error: tErr('email') };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        budgetOrPackage,
        message,
        status: 'NEW',
        locale,
      },
    });
  } catch (err) {
    console.error('[submitContactAction]', err);
    return { error: tErr('server') };
  }

  return {
    error: null,
    ok: true,
    redirectTo: `/${locale}/thank-you?type=contact`,
  };
}

export const contactInitialActionState: ContactActionState = { error: null };
