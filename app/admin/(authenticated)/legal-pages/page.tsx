import type { LegalDocument as DbLegalRow } from '@prisma/client';
import { Scale } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { createLegalDocumentAction, deleteLegalDocumentAction, updateLegalDocumentAction } from './actions';

export const dynamic = 'force-dynamic';

const SUGGESTED_SLUGS = ['privacy-policy', 'terms-of-service', 'refund-policy'] as const;

export default async function AdminLegalPagesPage() {
  const d = await getAdminDictServer();
  let rows: DbLegalRow[] = [];
  let dbError = false;
  try {
    rows = await prisma.legalDocument.findMany({
      orderBy: [{ slug: 'asc' }],
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
          <Scale className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.navLegal}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">
          Store legal copy in the database for a future switch from static markdown. Suggested slugs:{' '}
          {SUGGESTED_SLUGS.join(', ')}.
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
          <h2 className="mb-4 text-lg font-medium text-neutral-100">New legal document</h2>
          <form action={createLegalDocumentAction} className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
              <input name="slug" required className={inputClass} placeholder="privacy-policy" list="legal-slug-suggestions" />
              <datalist id="legal-slug-suggestions">
                {SUGGESTED_SLUGS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
              <input name="title" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">Body</label>
              <textarea name="body" required rows={12} className={inputClass} placeholder="Policy text" />
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
          {rows.map((doc) => (
            <li
              key={doc.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <form action={updateLegalDocumentAction} className="grid gap-4">
                <input type="hidden" name="id" value={doc.id} />
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
                  <input name="slug" required defaultValue={doc.slug} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
                  <input name="title" required defaultValue={doc.title} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">Body</label>
                  <textarea name="body" required rows={12} defaultValue={doc.body} className={inputClass} />
                </div>
                <button
                  type="submit"
                  className="w-fit rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                >
                  {d.save}
                </button>
              </form>
              <div className="mt-4 border-t border-[var(--ds-admin-border)] pt-4">
                <form action={deleteLegalDocumentAction}>
                  <input type="hidden" name="id" value={doc.id} />
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
