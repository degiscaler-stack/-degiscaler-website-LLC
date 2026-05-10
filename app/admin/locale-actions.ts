'use server';

import { cookies } from 'next/headers';
import { ADMIN_LOCALE_COOKIE, ADMIN_LOCALES, type AdminLocale } from '@/lib/admin-i18n/constants';

export async function setAdminLocaleAction(locale: string) {
  const l = ADMIN_LOCALES.includes(locale as AdminLocale) ? locale : 'en';
  (await cookies()).set(ADMIN_LOCALE_COOKIE, l, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
  });
}
