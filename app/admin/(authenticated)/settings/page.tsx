import { Settings } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { upsertSiteSettingAction } from './actions';

export const dynamic = 'force-dynamic';

const MANAGED_KEYS = ['siteUrl', 'supportEmail', 'companyName', 'defaultLocale', 'chatbotEnabled'] as const;

export default async function AdminSettingsPage() {
  const d = await getAdminDictServer();
  let dbError = false;
  let settingsMap: Record<string, string> = {};

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...MANAGED_KEYS] } },
    });
    settingsMap = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    dbError = true;
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600';

  const chatOn = settingsMap.chatbotEnabled === 'true';

  return (
    <div className="space-y-10">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          <Settings className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.navSettings}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          Non-sensitive site preferences stored in <code className="text-neutral-500">SiteSetting</code>. Secrets such as{' '}
          <code className="text-neutral-500">DATABASE_URL</code>, <code className="text-neutral-500">JWT_SECRET</code>,
          and passwords are never shown or editable here.
        </p>
      </div>

      {dbError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.adminDbUnavailable}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <form action={upsertSiteSettingAction} className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5">
            <input type="hidden" name="key" value="siteUrl" />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">Site URL</span>
              <input name="value" type="text" defaultValue={settingsMap.siteUrl ?? ''} className={inputClass} />
            </label>
            <p className="mt-2 text-xs text-neutral-500">Public URL for reference (e.g. https://degiscaler.com).</p>
            <button
              type="submit"
              className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
            >
              {d.save}
            </button>
          </form>

          <form action={upsertSiteSettingAction} className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5">
            <input type="hidden" name="key" value="supportEmail" />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">Support email</span>
              <input name="value" type="email" defaultValue={settingsMap.supportEmail ?? ''} className={inputClass} />
            </label>
            <button
              type="submit"
              className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
            >
              {d.save}
            </button>
          </form>

          <form action={upsertSiteSettingAction} className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5">
            <input type="hidden" name="key" value="companyName" />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">Company name</span>
              <input name="value" type="text" defaultValue={settingsMap.companyName ?? ''} className={inputClass} />
            </label>
            <button
              type="submit"
              className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
            >
              {d.save}
            </button>
          </form>

          <form action={upsertSiteSettingAction} className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5">
            <input type="hidden" name="key" value="defaultLocale" />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">Default locale (informational)</span>
              <input name="value" type="text" defaultValue={settingsMap.defaultLocale ?? 'en'} className={inputClass} />
            </label>
            <p className="mt-2 text-xs text-neutral-500">
              Public EN / AR / FR remain controlled by the storefront; this value is optional metadata only.
            </p>
            <button
              type="submit"
              className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
            >
              {d.save}
            </button>
          </form>

          <form
            action={upsertSiteSettingAction}
            className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5 lg:col-span-2"
          >
            <input type="hidden" name="key" value="chatbotEnabled" />
            <input type="hidden" name="enabled" value="false" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-200">Chat widget</p>
                <p className="mt-1 text-xs text-neutral-500">
                  When disabled in templates that read this flag, the widget stays hidden.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" name="enabled" value="true" defaultChecked={chatOn} className="size-4 rounded border-neutral-600" />
                Enabled
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
            >
              {d.save}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
