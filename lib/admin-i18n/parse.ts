import { ADMIN_LOCALES, type AdminLocale } from '@/lib/admin-i18n/constants';

export function parseAdminLocale(raw: string | undefined): AdminLocale {
  const v = raw?.trim().toLowerCase();
  return ADMIN_LOCALES.includes(v as AdminLocale) ? (v as AdminLocale) : 'en';
}
