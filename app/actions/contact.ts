'use server';

import { getTranslations } from 'next-intl/server';
import type { ContactActionState } from '@/lib/actions/public-form-state';
import { isValidEmail } from '@/lib/validation/email';
import { safeCreateContactMessage } from '@/lib/db/public-safe';

export async function submitContactAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const locale = 'en';

  const fullName =
    String(formData.get('fullName') ?? formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  /** Stored in legacy `whatsapp` column — order reference for product support. */
  const orderNumber = String(formData.get('orderNumber') ?? '').trim() || null;
  /** Stored in legacy `budgetOrPackage` column — purchased kit name. */
  const productName = String(formData.get('productName') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim();

  const errFallback: Record<string, string> = {
    required: 'Please fill in all required fields.',
    email: 'Please enter a valid email address.',
    server: 'Something went wrong. Please try again shortly.',
  };
  let tErr = (k: string) => errFallback[k] ?? k;
  try {
    const gt = await getTranslations('contactPage.errors');
    tErr = (k: string) => gt(k as never);
  } catch (err) {
    console.error('[submitContactAction] getTranslations', err);
  }

  if (!fullName || !email || !productName || !message) {
    return { error: tErr('required') };
  }
  if (!isValidEmail(email)) {
    return { error: tErr('email') };
  }

  const result = await safeCreateContactMessage({
    fullName,
    email,
    whatsapp: orderNumber,
    budgetOrPackage: productName,
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
    redirectTo: '/thank-you?type=contact',
  };
}

