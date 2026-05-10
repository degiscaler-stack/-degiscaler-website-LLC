import type { ReactNode } from 'react';
import { AdminLocaleProvider } from '@/components/admin/AdminLocaleProvider';

/** Shared admin chrome (outside locale middleware). Login and dashboard nest here. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLocaleProvider>
      <div className="min-h-screen bg-[#050505] text-[#f5f2e9] [--ds-admin-accent:#e8cc65] [--ds-admin-border:rgba(255,255,255,0.08)]">
        {children}
      </div>
    </AdminLocaleProvider>
  );
}
