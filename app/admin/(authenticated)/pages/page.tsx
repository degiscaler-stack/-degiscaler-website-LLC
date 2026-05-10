import type { SitePage as DbSitePageRow } from '@prisma/client';
import { FileText } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { createSitePageAction, deleteSitePageAction, updateSitePageAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPagesEditorPage() {
  const d = await getAdminDictServer();
  let rows: DbSitePageRow[] = [];
  let dbError = false;
  try {
    rows = await prisma.sitePage.findMany({
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
          <FileText className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.navPages}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          Basic slug + HTML-safe plain text storage for future routing. A visual drag-and-drop builder can plug in
          later — this module stays stable for Hostinger production.
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
          <h2 className="mb-4 text-lg font-medium text-neutral-100">New page</h2>
          <form action={createSitePageAction} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
                <input name="slug" required className={inputClass} placeholder="about-extra" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
                <input name="title" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">Body</label>
              <textarea name="body" required rows={8} className={inputClass} placeholder="Page content (plain text)" />
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input name="isPublished" type="checkbox" className="size-4 rounded border-neutral-600" />
                Published (reserved for future public routing)
              </label>
            </div>
            <button
              type="submit"
              className="w-fit rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
            >
              {d.create}
            </button>
          </form>
        </section>
      ) : null}

      {!dbError && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-12 text-center text-sm text-neutral-500">
          {d.noData}
        </div>
      ) : dbError ? null : (
        <ul className="space-y-6">
          {rows.map((pg) => (
            <li
              key={pg.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <form action={updateSitePageAction} className="grid gap-4">
                <input type="hidden" name="id" value={pg.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
                    <input name="slug" required defaultValue={pg.slug} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
                    <input name="title" required defaultValue={pg.title} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Body</label>
                  <textarea name="body" required rows={8} defaultValue={pg.body} className={inputClass} />
                </div>
                <div className="flex flex-wrap items-end gap-6">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                    <input name="sortOrder" type="number" defaultValue={pg.sortOrder} className={inputClass} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      name="isPublished"
                      type="checkbox"
                      defaultChecked={pg.isPublished}
                      className="size-4 rounded border-neutral-600"
                    />
                    Published
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-fit rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                >
                  {d.save}
                </button>
              </form>
              <div className="mt-4 border-t border-[var(--ds-admin-border)] pt-4">
                <form action={deleteSitePageAction}>
                  <input type="hidden" name="id" value={pg.id} />
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
