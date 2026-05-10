import { cookies } from 'next/headers';
import { getAdminDictionary } from '@/lib/admin-i18n/dictionaries';
import { ADMIN_LOCALE_COOKIE } from '@/lib/admin-i18n/constants';
import { parseAdminLocale } from '@/lib/admin-i18n/parse';

export async function getAdminDictServer() {
  const jar = await cookies();
  return getAdminDictionary(parseAdminLocale(jar.get(ADMIN_LOCALE_COOKIE)?.value));
}
