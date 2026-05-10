'use client';

import { createContext, useContext, useMemo } from 'react';
import { getAdminDictionary, type AdminDict } from '@/lib/admin-i18n/dictionaries';

type Ctx = {
  dict: AdminDict;
};

const AdminI18nContext = createContext<Ctx | null>(null);

/** Admin UI is English-only; always serves the English dictionary. */
export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const dict = useMemo(() => getAdminDictionary('en'), []);
  const value = useMemo(() => ({ dict }), [dict]);
  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) {
    throw new Error('useAdminI18n must be used within AdminLocaleProvider');
  }
  return ctx;
}
