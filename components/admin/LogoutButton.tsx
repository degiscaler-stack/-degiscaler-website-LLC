'use client';

import { useFormStatus } from 'react-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';

function Submit() {
  const { pending } = useFormStatus();
  const { dict } = useAdminI18n();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--ds-admin-border)] bg-[#111] px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-[#141414] disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
      <LogOut className="size-3.5" aria-hidden />
      {dict.logout}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Submit />
    </form>
  );
}
