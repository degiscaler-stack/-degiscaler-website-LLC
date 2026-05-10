'use client';

import Link from 'next/link';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';

export function LoginFooterLink() {
  const { dict } = useAdminI18n();
  return (
    <p className="mt-8 text-center text-xs text-neutral-600">
      <Link href="/en" className="text-neutral-400 hover:text-neutral-300">
        {dict.backToSite}
      </Link>
    </p>
  );
}
