import type { Service as DbServiceRow } from '@prisma/client';
import { BriefcaseBusiness } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { createServiceAction, deleteServiceAction, updateServiceAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const d = await getAdminDictServer();
  let rows: DbServiceRow[] = [];
  let dbError = false;
  try {
    rows = await prisma.service.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
  } catch {
    dbError = true;
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600';

  return (
    <div className="space-y-10">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          <BriefcaseBusiness className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.navServices}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          Manage services stored in the database. Public services pages can be wired to this data in a later release —
          updates here are safe and will not affect orders or chat.
        </p>
      </div>

      {dbError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.adminDbUnavailable}
        </div>
      ) : null}

      {!dbError ? (
        <section className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
          <h2 className="mb-4 text-lg font-medium text-neutral-100">Add service</h2>
          <form action={createServiceAction} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
              <input name="slug" required className={inputClass} placeholder="starter-kit" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
              <input name="title" required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-400">Short description</label>
              <input name="shortDescription" className={inputClass} placeholder="One-line summary" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.description}</label>
              <textarea name="description" required rows={5} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
              <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input name="isActive" type="checkbox" defaultChecked className="size-4 rounded border-neutral-600" />
                {d.active}
              </label>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)] hover:bg-[color-mix(in_srgb,var(--ds-admin-accent)_18%,transparent)]"
              >
                {d.create}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {!dbError && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-12 text-center text-sm text-neutral-500">
          {d.noData}
        </div>
      ) : dbError ? null : (
        <ul className="space-y-6">
          {rows.map((svc) => (
            <li
              key={svc.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <form action={updateServiceAction} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={svc.id} />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
                  <input name="slug" required defaultValue={svc.slug} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
                  <input name="title" required defaultValue={svc.title} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Short description</label>
                  <input
                    name="shortDescription"
                    defaultValue={svc.shortDescription ?? ''}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.description}</label>
                  <textarea name="description" required rows={5} defaultValue={svc.description} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                  <input name="sortOrder" type="number" defaultValue={svc.sortOrder} className={inputClass} />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={svc.isActive}
                      className="size-4 rounded border-neutral-600"
                    />
                    {d.active}
                  </label>
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                  >
                    {d.save}
                  </button>
                </div>
              </form>
              <div className="mt-4 border-t border-[var(--ds-admin-border)] pt-4">
                <form action={deleteServiceAction}>
                  <input type="hidden" name="id" value={svc.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-950/60"
                  >
                    {d.delete}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
