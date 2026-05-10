'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import type { AdminLocale } from '@/lib/admin-i18n/constants';
import { getAdminDictionary, type AdminDict } from '@/lib/admin-i18n/dictionaries';
import { setAdminLocaleAction } from '@/app/admin/locale-actions';

type Ctx = {
  locale: AdminLocale;
  dict: AdminDict;
  setLocale: (locale: AdminLocale) => void;
  pending: boolean;
};

const AdminI18nContext = createContext<Ctx | null>(null);

export function AdminLocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: AdminLocale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AdminLocale>(initialLocale);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  const dict = useMemo(() => getAdminDictionary(locale), [locale]);

  const setLocale = useCallback(
    (next: AdminLocale) => {
      startTransition(async () => {
        await setAdminLocaleAction(next);
        setLocaleState(next);
        router.refresh();
      });
    },
    [router],
  );

  const value = useMemo(() => ({ locale, dict, setLocale, pending }), [locale, dict, setLocale, pending]);

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) {
    throw new Error('useAdminI18n must be used within AdminLocaleProvider');
  }
  return ctx;
}
