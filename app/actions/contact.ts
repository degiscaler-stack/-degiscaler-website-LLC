'use server';

import { getTranslations } from 'next-intl/server';
import type { ContactActionState } from '@/lib/actions/public-form-state';
import { routing } from '@/i18n/routing';
import { isValidEmail } from '@/lib/validation/email';
import { safeCreateContactMessage } from '@/lib/db/public-safe';

export async function submitContactAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const localeRaw = String(formData.get('locale') ?? '').trim().toLowerCase();
  const locale = routing.locales.includes(localeRaw as (typeof routing.locales)[number])
    ? localeRaw
    : routing.defaultLocale;

  const fullName =
    String(formData.get('fullName') ?? formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const budgetOrPackage = String(formData.get('budgetOrPackage') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim();

  const errFallback: Record<string, string> = {
    required: 'Please fill in all required fields.',
    email: 'Please enter a valid email address.',
    server: 'Something went wrong. Please try again shortly.',
  };
  let tErr = (k: string) => errFallback[k] ?? k;
  try {
    const gt = await getTranslations({ locale, namespace: 'contactPage.errors' });
    tErr = (k: string) => gt(k as never);
  } catch (err) {
    console.error('[submitContactAction] getTranslations', err);
  }

  if (!fullName || !email || !message) {
    return { error: tErr('required') };
  }
  if (!isValidEmail(email)) {
    return { error: tErr('email') };
  }

  const result = await safeCreateContactMessage({
    fullName,
    email,
    budgetOrPackage,
    message,
    status: 'NEW',
    locale,
  });

  if (!result.ok) {
    return { error: tErr('server') };
  }

  return {
    error: null,
    ok: true,
    redirectTo: `/${locale}/thank-you?type=contact`,
  };
}

