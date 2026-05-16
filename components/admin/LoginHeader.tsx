'use client';

import Link from 'next/link';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';

export function LoginHeader() {
  const { dict } = useAdminI18n();
  return (
    <div className="mb-8 text-center">
      <Link
        href="/en"
        className="inline-block bg-gradient-to-r from-[#e8cc65] via-[#d6a700] to-[#ff8411] bg-clip-text text-xl font-semibold tracking-tight text-transparent"
      >
        DigiScaler
      </Link>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-500">{dict.adminPanel}</p>
    </div>
  );
}
