import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Inbox, MessagesSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';

export default async function AdminOverviewPage() {
  const d = await getAdminDictServer();
  let pkgCount = 0;
  let orderCount = 0;
  let msgCount = 0;
  let chatCount = 0;
  let dbError = false;
  try {
    [pkgCount, orderCount, msgCount, chatCount] = await Promise.all([
      prisma.package.count(),
      prisma.order.count(),
      prisma.contactMessage.count(),
      prisma.supportConversation.count(),
    ]);
  } catch {
    dbError = true;
  }

  const tiles = [
    {
      href: '/admin/packages',
      title: d.packagesTitle,
      value: pkgCount,
      icon: Package,
    },
    {
      href: '/admin/orders',
      title: d.ordersTitle,
      value: orderCount,
      icon: ShoppingBag,
    },
    {
      href: '/admin/contact-messages',
      title: d.contactTitle,
      value: msgCount,
      icon: Inbox,
    },
    {
      href: '/admin/chat-support',
      title: d.chatScreenTitle,
      value: chatCount,
      icon: MessagesSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          <LayoutDashboard className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.overviewTitle}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-400">{d.overviewSubtitle}</p>
      </div>

      {dbError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.adminDbUnavailable}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ href, title, value, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-colors hover:border-[color-mix(in_srgb,var(--ds-admin-accent)_35%,transparent)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-neutral-200">{title}</p>
                <p className="mt-3 text-3xl font-semibold tabular-nums text-[var(--ds-admin-accent)]">{value}</p>
              </div>
              <Icon className="size-6 shrink-0 text-[var(--ds-admin-accent)] opacity-85" aria-hidden />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-6 text-center text-sm text-neutral-500">
        {d.overviewFootnote}
      </div>
    </div>
  );
}
