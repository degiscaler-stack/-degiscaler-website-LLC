import type { ContactMessage as DbContactRow } from '@prisma/client';
import { Inbox } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { updateContactStatusAction } from './actions';

export default async function ContactMessagesPage() {
  const d = await getAdminDictServer();
  let rows: DbContactRow[] = [];
  let dbError = false;
  try {
    rows = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          <Inbox className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.contactTitle}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">{d.contactDetails}</p>
      </div>

      {dbError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.adminDbUnavailable}
        </div>
      ) : null}

      {!dbError && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-12 text-center text-sm text-neutral-500">
          {d.noData}
        </div>
      ) : dbError ? null : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-2 text-sm">
                  <p className="font-medium text-neutral-100">{row.fullName}</p>
                  <p className="text-neutral-400">
                    <span className="text-neutral-500">{d.email}: </span>
                    <a className="text-[var(--ds-admin-accent)] hover:underline" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </p>
                  {row.whatsapp ? (
                    <p className="text-neutral-400">
                      <span className="text-neutral-500">{d.whatsapp}: </span>
                      {row.whatsapp}
                    </p>
                  ) : null}
                  {row.budgetOrPackage ? (
                    <p className="text-neutral-400">
                      <span className="text-neutral-500">{d.budgetInterest}: </span>
                      {row.budgetOrPackage}
                    </p>
                  ) : null}
                  {row.message ? (
                    <p className="whitespace-pre-wrap text-neutral-300">{row.message}</p>
                  ) : (
                    <p className="text-sm text-neutral-500">—</p>
                  )}
                  <p className="text-xs text-neutral-500">
                    {d.dateLabel}:{' '}
                    {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
                      row.createdAt,
                    )}
                  </p>
                </div>
                <form action={updateContactStatusAction} className="flex shrink-0 flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={row.id} />
                  <label className="sr-only" htmlFor={`contact-status-${row.id}`}>
                    {d.status}
                  </label>
                  <select
                    id={`contact-status-${row.id}`}
                    name="status"
                    defaultValue={row.status}
                    className="rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950 px-3 py-2 text-sm text-white"
                  >
                    <option value="NEW">{d.statusNew}</option>
                    <option value="READ">{d.statusRead}</option>
                    <option value="CLOSED">{d.statusClosed}</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-3 py-2 text-sm font-medium text-[var(--ds-admin-accent)] hover:bg-[color-mix(in_srgb,var(--ds-admin-accent)_18%,transparent)]"
                  >
                    {d.updateStatus}
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
