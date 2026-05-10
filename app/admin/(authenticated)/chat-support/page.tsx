import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { MessagesSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import { replySupportAction, updateSupportConversationStatusAction } from './actions';

const listInclude = {
  messages: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    select: { body: true, createdAt: true, sender: true },
  },
} satisfies Prisma.SupportConversationInclude;

type ConversationListRow = Prisma.SupportConversationGetPayload<{ include: typeof listInclude }>;

const threadInclude = {
  messages: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.SupportConversationInclude;

type ConversationThread = Prisma.SupportConversationGetPayload<{ include: typeof threadInclude }>;

export default async function AdminChatSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const q = await searchParams;
  const selectedId = typeof q.c === 'string' ? q.c.trim() : '';
  const d = await getAdminDictServer();

  let conversations: ConversationListRow[] = [];
  let listDbError = false;
  try {
    conversations = await prisma.supportConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: listInclude,
    });
  } catch {
    listDbError = true;
  }

  let thread: ConversationThread | null = null;
  let threadDbError = false;
  if (selectedId) {
    try {
      thread = await prisma.supportConversation.findUnique({
        where: { id: selectedId },
        include: threadInclude,
      });
    } catch {
      threadDbError = true;
      thread = null;
    }
  }

  const statusLabel = (s: string) =>
    s === 'WAITING' ? d.chatStatusWaiting : s === 'CLOSED' ? d.chatStatusClosed : d.chatStatusOpen;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          <MessagesSquare className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.chatScreenTitle}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">{d.chatOverviewSubtitle}</p>
      </div>

      {listDbError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.adminDbUnavailable}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-300">{d.chatConversations}</h2>
          {(!listDbError && conversations.length === 0) ? (
            <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-8 text-center text-sm text-neutral-500">
              {d.chatNoConversations}
            </div>
          ) : listDbError ? null : (
            <ul className="space-y-2">
              {conversations.map((c) => {
                const last = c.messages[0];
                const active = c.id === selectedId;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/admin/chat-support?c=${encodeURIComponent(c.id)}`}
                      className={`block rounded-xl border px-4 py-3 text-sm transition-colors ${
                        active
                          ? 'border-[color-mix(in_srgb,var(--ds-admin-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_8%,transparent)]'
                          : 'border-[var(--ds-admin-border)] bg-[#0a0a0a] hover:border-[color-mix(in_srgb,var(--ds-admin-accent)_25%,transparent)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-neutral-100">{c.fullName ?? '—'}</span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wide text-neutral-500">
                          {statusLabel(c.status)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-neutral-500">{c.email ?? ''}</p>
                      {last ? (
                        <p className="mt-2 line-clamp-2 text-xs text-neutral-400">
                          <span className="text-neutral-600">{d.chatLastMessage}: </span>
                          {last.body}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="min-w-0">
          {threadDbError && selectedId ? (
            <div
              role="alert"
              className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
            >
              {d.adminDbUnavailable}
            </div>
          ) : !thread ? (
            <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-10 text-center text-sm text-neutral-500">
              {selectedId ? d.chatConversationNotFound : d.chatSelectConversation}
            </div>
          ) : (
            <div className="space-y-6 rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
              <div className="flex flex-wrap gap-4 border-b border-[var(--ds-admin-border)] pb-4 text-sm">
                <div>
                  <span className="text-neutral-500">{d.fullName}: </span>
                  <span className="text-neutral-200">{thread.fullName ?? '—'}</span>
                </div>
                <div>
                  <span className="text-neutral-500">{d.email}: </span>
                  <span className="text-neutral-200">{thread.email ?? '—'}</span>
                </div>
                <div>
                  <span className="text-neutral-500">{d.whatsapp}: </span>
                  <span className="text-neutral-200">{thread.whatsapp ?? '—'}</span>
                </div>
                <div>
                  <span className="text-neutral-500">{d.status}: </span>
                  <span className="text-neutral-200">{statusLabel(thread.status)}</span>
                </div>
              </div>

              <form action={updateSupportConversationStatusAction} className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="conversationId" value={thread.id} />
                <label className="text-xs text-neutral-400" htmlFor="sup-st">
                  {d.status}
                </label>
                <select
                  id="sup-st"
                  name="status"
                  defaultValue={thread.status}
                  className="rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950 px-3 py-2 text-sm text-white"
                >
                  <option value="OPEN">{d.chatStatusOpen}</option>
                  <option value="WAITING">{d.chatStatusWaiting}</option>
                  <option value="CLOSED">{d.chatStatusClosed}</option>
                </select>
                <button
                  type="submit"
                  className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-3 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                >
                  {d.updateStatus}
                </button>
              </form>

              <ul className="max-h-[420px] space-y-3 overflow-y-auto rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950/40 p-4">
                {thread.messages.map((m) => (
                  <li
                    key={m.id}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      m.sender === 'ADMIN'
                        ? 'border-[color-mix(in_srgb,var(--ds-admin-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_10%,transparent)]'
                        : 'border-[var(--ds-admin-border)] bg-[#0a0a0a]'
                    }`}
                  >
                    <div className="mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
                      {m.sender === 'ADMIN' ? d.chatAdmin : m.sender === 'VISITOR' ? d.chatVisitor : m.sender}
                    </div>
                    <p className="whitespace-pre-wrap text-neutral-200">{m.body}</p>
                    <p className="mt-1 text-[10px] text-neutral-600">
                      {new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(
                        m.createdAt,
                      )}
                    </p>
                  </li>
                ))}
              </ul>

              <form action={replySupportAction} className="space-y-3">
                <input type="hidden" name="conversationId" value={thread.id} />
                <label className="block text-xs font-medium text-neutral-400" htmlFor="sup-reply">
                  {d.chatReply}
                </label>
                <textarea
                  id="sup-reply"
                  name="body"
                  required
                  rows={4}
                  placeholder={d.chatReplyPlaceholder}
                  className="w-full rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)]"
                >
                  {d.chatSendReply}
                </button>
              </form>

              <Link href="/admin/chat-support" className="inline-block text-xs text-neutral-500 hover:text-neutral-300">
                {d.chatBackToList}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
