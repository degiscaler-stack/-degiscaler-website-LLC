import { getAdminDictionary } from '@/lib/admin-i18n/dictionaries';

/** Admin dashboard copy is English-only (public site locales are unchanged). */
export async function getAdminDictServer() {
  return getAdminDictionary('en');
}
