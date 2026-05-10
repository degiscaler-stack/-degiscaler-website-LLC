import type { Testimonial as DbRow } from '@prisma/client';
import { MessageSquareQuote } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { createTestimonialAction, deleteTestimonialAction, updateTestimonialAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const d = await getAdminDictServer();
  let rows: DbRow[] = [];
  let dbError = false;
  try {
    rows = await prisma.testimonial.findMany({
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
          <MessageSquareQuote className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.navTestimonials}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          Collect testimonials for future homepage sections. Safe to edit anytime.
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
          <h2 className="mb-4 text-lg font-medium text-neutral-100">Add testimonial</h2>
          <form action={createTestimonialAction} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.fullName}</label>
              <input name="name" required className={inputClass} placeholder="Client name" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">Role / company (optional)</label>
              <input name="roleOrCompany" className={inputClass} placeholder="Founder, ACME LLC" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-400">Quote</label>
              <textarea name="quote" required rows={4} className={inputClass} />
            </div>
            <div className="flex flex-wrap items-end gap-6 sm:col-span-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input name="isActive" type="checkbox" defaultChecked className="size-4 rounded border-neutral-600" />
                {d.active}
              </label>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
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
          {rows.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <form action={updateTestimonialAction} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={t.id} />
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.fullName}</label>
                  <input name="name" required defaultValue={t.name} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Role / company</label>
                  <input name="roleOrCompany" defaultValue={t.roleOrCompany ?? ''} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Quote</label>
                  <textarea name="quote" required rows={4} defaultValue={t.quote} className={inputClass} />
                </div>
                <div className="flex flex-wrap items-end gap-6 sm:col-span-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                    <input name="sortOrder" type="number" defaultValue={t.sortOrder} className={inputClass} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={t.isActive}
                      className="size-4 rounded border-neutral-600"
                    />
                    {d.active}
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                  >
                    {d.save}
                  </button>
                </div>
              </form>
              <div className="mt-4 border-t border-[var(--ds-admin-border)] pt-4">
                <form action={deleteTestimonialAction}>
                  <input type="hidden" name="id" value={t.id} />
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
