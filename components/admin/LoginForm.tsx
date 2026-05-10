'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  loginAdminAction,
  loginInitialState,
  type LoginActionState,
} from '@/app/admin/login/actions';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';

function loginMessage(state: LoginActionState, dict: ReturnType<typeof useAdminI18n>['dict']): string | null {
  switch (state.code) {
    case 'MISSING':
      return dict.loginMissingFields;
    case 'BAD_CREDENTIALS':
      return dict.invalidCredentials;
    case 'DOWN':
      return dict.loginUnavailable;
    case 'CONFIG':
      return dict.loginConfigIssue;
    default:
      return null;
  }
}

export function LoginForm() {
  const { dict } = useAdminI18n();
  const [state, formAction, isPending] = useActionState(loginAdminAction, loginInitialState);
  const msg = loginMessage(state, dict);

  return (
    <form action={formAction} className="space-y-5">
      {msg ? (
        <div
          className="rounded-lg border border-red-500/30 bg-red-950/35 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {msg}
        </div>
      ) : null}

      <label className="block space-y-2 rtl:text-right">
        <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">{dict.email}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-[var(--ds-admin-border)] bg-[#111] px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[color-mix(in_srgb,var(--ds-admin-accent)_45%,transparent)] disabled:opacity-60"
          placeholder="admin@yourcompany.com"
        />
      </label>

      <label className="block space-y-2 rtl:text-right">
        <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">{dict.password}</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-[var(--ds-admin-border)] bg-[#111] px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[color-mix(in_srgb,var(--ds-admin-accent)_45%,transparent)] disabled:opacity-60"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#e8cc65] px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-[0_12px_40px_-12px_rgba(212,175,55,0.55)] hover:opacity-95 disabled:opacity-60"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {dict.signIn}
      </button>
    </form>
  );
}
