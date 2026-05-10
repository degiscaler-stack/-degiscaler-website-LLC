import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AdminLocaleProvider } from '@/components/admin/AdminLocaleProvider';
import { ADMIN_LOCALE_COOKIE } from '@/lib/admin-i18n/constants';
import { parseAdminLocale } from '@/lib/admin-i18n/parse';

/** Shared admin chrome (outside locale middleware). Login and dashboard nest here. */
export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const locale = parseAdminLocale(jar.get(ADMIN_LOCALE_COOKIE)?.value);

  return (
    <AdminLocaleProvider initialLocale={locale}>
      <div className="min-h-screen bg-[#050505] text-[#f5f2e9] [--ds-admin-accent:#e8cc65] [--ds-admin-border:rgba(255,255,255,0.08)]">
        {children}
      </div>
    </AdminLocaleProvider>
  );
}
