'use client';

import type { AdminLocale } from '@/lib/admin-i18n/constants';
import { ADMIN_LOCALES } from '@/lib/admin-i18n/constants';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';

export function AdminLocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, pending } = useAdminI18n();

  return (
    <div className={`flex items-center gap-1 rounded-lg border border-[var(--ds-admin-border)] bg-[#111] p-1 ${className ?? ''}`}>
      {ADMIN_LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            onClick={() => setLocale(code as AdminLocale)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-50 ${
              active
                ? 'bg-[color-mix(in_srgb,var(--ds-admin-accent)_22%,transparent)] text-[var(--ds-admin-accent)]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
