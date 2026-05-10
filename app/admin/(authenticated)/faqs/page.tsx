import type { Faq as DbFaqRow } from '@prisma/client';
import { HelpCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { createFaqAction, deleteFaqAction, updateFaqAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminFaqsPage() {
  const d = await getAdminDictServer();
  let rows: DbFaqRow[] = [];
  let dbError = false;
  try {
    rows = await prisma.faq.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
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
          <HelpCircle className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.navFaqs}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          FAQs are stored for future use on the public FAQ page. Empty state is safe until you add entries.
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
          <h2 className="mb-4 text-lg font-medium text-neutral-100">Add FAQ</h2>
          <form action={createFaqAction} className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">Question</label>
              <textarea name="question" required rows={3} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">Answer</label>
              <textarea name="answer" required rows={5} className={inputClass} />
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input name="isActive" type="checkbox" defaultChecked className="size-4 rounded border-neutral-600" />
                {d.active}
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
          {rows.map((faq) => (
            <li
              key={faq.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <form action={updateFaqAction} className="grid gap-4">
                <input type="hidden" name="id" value={faq.id} />
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Question</label>
                  <textarea name="question" required rows={3} defaultValue={faq.question} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Answer</label>
                  <textarea name="answer" required rows={5} defaultValue={faq.answer} className={inputClass} />
                </div>
                <div className="flex flex-wrap items-end gap-6">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                    <input name="sortOrder" type="number" defaultValue={faq.sortOrder} className={inputClass} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={faq.isActive}
                      className="size-4 rounded border-neutral-600"
                    />
                    {d.active}
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                  >
                    {d.save}
                  </button>
                </div>
              </form>
              <div className="mt-4 border-t border-[var(--ds-admin-border)] pt-4">
                <form action={deleteFaqAction}>
                  <input type="hidden" name="id" value={faq.id} />
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
