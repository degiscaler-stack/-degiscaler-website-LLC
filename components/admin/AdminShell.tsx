'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  BriefcaseBusiness,
  HelpCircle,
  MessageSquareQuote,
  FileText,
  Scale,
  Inbox,
  MessagesSquare,
  Settings,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';
import type { AdminDict } from '@/lib/admin-i18n/dictionaries';

type NavKey = keyof Pick<
  AdminDict,
  | 'navOverview'
  | 'navPackages'
  | 'navServices'
  | 'navFaqs'
  | 'navTestimonials'
  | 'navPages'
  | 'navLegal'
  | 'navOrders'
  | 'navContact'
  | 'navChat'
  | 'navSettings'
>;

const NAV: { href: string; dictKey: NavKey; icon: LucideIcon }[] = [
  { href: '/admin', dictKey: 'navOverview', icon: LayoutDashboard },
  { href: '/admin/packages', dictKey: 'navPackages', icon: Package },
  { href: '/admin/services', dictKey: 'navServices', icon: BriefcaseBusiness },
  { href: '/admin/faqs', dictKey: 'navFaqs', icon: HelpCircle },
  { href: '/admin/testimonials', dictKey: 'navTestimonials', icon: MessageSquareQuote },
  { href: '/admin/pages', dictKey: 'navPages', icon: FileText },
  { href: '/admin/legal-pages', dictKey: 'navLegal', icon: Scale },
  { href: '/admin/orders', dictKey: 'navOrders', icon: ShoppingBag },
  { href: '/admin/contact-messages', dictKey: 'navContact', icon: Inbox },
  { href: '/admin/chat-support', dictKey: 'navChat', icon: MessagesSquare },
  { href: '/admin/settings', dictKey: 'navSettings', icon: Settings },
];

export function AdminShell({
  emailHint,
  children,
}: {
  emailHint?: string;
  children: ReactNode;
}) {
  const { dict } = useAdminI18n();

  return (
    <div className="flex min-h-screen" dir="ltr">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--ds-admin-border)] bg-[#080808] lg:flex">
        <div className="border-b border-[var(--ds-admin-border)] px-5 py-4">
          <div className="bg-gradient-to-r from-[#e8cc65] via-[#d6a700] to-[#ff8411] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            DegiScaler
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">{dict.adminPanel}</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const label = dict[item.dictKey];
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/[0.04] hover:text-white"
                  >
                    <Icon className="size-4 shrink-0 text-[var(--ds-admin-accent)]" aria-hidden />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[var(--ds-admin-border)] px-4 py-3 text-[11px] text-neutral-600">
          <Lock className="mb-1 mr-1 inline-block size-3 opacity-70" aria-hidden /> {dict.secureArea}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-end gap-4 border-b border-[var(--ds-admin-border)] bg-[#050505]/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-neutral-300">DegiScaler · {dict.adminPanel}</div>
            <div className="truncate text-[11px] text-neutral-600">{dict.mobileNavHint}</div>
          </div>
          <LogoutButton />
        </header>

        <header className="hidden items-center justify-end gap-6 border-b border-[var(--ds-admin-border)] bg-[#080808]/80 px-8 py-4 backdrop-blur lg:flex">
          <div className="flex items-center gap-4">
            {emailHint ? (
              <span className="max-w-[220px] truncate text-xs text-neutral-500" title={emailHint}>
                {emailHint}
              </span>
            ) : (
              <span className="text-xs text-neutral-600">{dict.administrator}</span>
            )}
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
