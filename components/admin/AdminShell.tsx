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
import { AdminLocaleSwitcher } from '@/components/admin/AdminLocaleSwitcher';
import { useAdminI18n } from '@/components/admin/AdminLocaleProvider';
import type { AdminDict } from '@/lib/admin-i18n/dictionaries';

type NavDef =
  | { href: string; soon?: false; dictKey: keyof Pick<
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
    >; icon: LucideIcon }
  | { soon: true; dictKey: keyof Pick<
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
    >; icon: LucideIcon };

const NAV: NavDef[] = [
  { href: '/admin', dictKey: 'navOverview', icon: LayoutDashboard },
  { href: '/admin/packages', dictKey: 'navPackages', icon: Package },
  { soon: true, dictKey: 'navServices', icon: BriefcaseBusiness },
  { soon: true, dictKey: 'navFaqs', icon: HelpCircle },
  { soon: true, dictKey: 'navTestimonials', icon: MessageSquareQuote },
  { soon: true, dictKey: 'navPages', icon: FileText },
  { soon: true, dictKey: 'navLegal', icon: Scale },
  { href: '/admin/orders', dictKey: 'navOrders', icon: ShoppingBag },
  { href: '/admin/contact-messages', dictKey: 'navContact', icon: Inbox },
  { href: '/admin/chat-support', dictKey: 'navChat', icon: MessagesSquare },
  { soon: true, dictKey: 'navSettings', icon: Settings },
];

export function AdminShell({
  emailHint,
  children,
}: {
  emailHint?: string;
  children: ReactNode;
}) {
  const { locale, dict } = useAdminI18n();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="flex min-h-screen" dir={dir}>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--ds-admin-border)] bg-[#080808] lg:flex rtl:border-r-0 rtl:border-l">
        <div className="border-b border-[var(--ds-admin-border)] px-5 py-4 rtl:text-right">
          <div className="bg-gradient-to-r from-[#e8cc65] via-[#d6a700] to-[#ff8411] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            DegiScaler
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">{dict.adminPanel}</p>
          <div className="mt-3 flex justify-start rtl:justify-end">
            <AdminLocaleSwitcher />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {NAV.map((item, idx) => {
              const label = dict[item.dictKey];
              const Icon = item.icon;
              if ('soon' in item && item.soon) {
                return (
                  <li key={`${String(item.dictKey)}-${idx}`}>
                    <span
                      title={dict.comingSoon}
                      className="flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500 opacity-90 rtl:flex-row-reverse"
                      aria-disabled
                    >
                      <Icon className="size-4 shrink-0 opacity-60" aria-hidden />
                      <span className="flex-1 truncate">{label}</span>
                      <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-600">
                        {dict.comingSoon}
                      </span>
                    </span>
                  </li>
                );
              }
              const linkItem = item as Extract<NavDef, { href: string }>;
              return (
                <li key={linkItem.href}>
                  <Link
                    href={linkItem.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/[0.04] hover:text-white rtl:flex-row-reverse"
                  >
                    <Icon className="size-4 shrink-0 text-[var(--ds-admin-accent)]" aria-hidden />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[var(--ds-admin-border)] px-4 py-3 text-[11px] text-neutral-600 rtl:text-right">
          <Lock className="mb-1 inline-block size-3 opacity-70 rtl:ml-1" aria-hidden /> {dict.secureArea}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-[var(--ds-admin-border)] bg-[#050505]/90 px-4 py-3 backdrop-blur-md lg:hidden rtl:flex-row-reverse">
          <div className="min-w-0 flex-1 rtl:text-right">
            <div className="truncate text-sm font-medium text-neutral-300">DegiScaler · {dict.adminPanel}</div>
            <div className="truncate text-[11px] text-neutral-600">{dict.mobileNavHint}</div>
          </div>
          <AdminLocaleSwitcher />
          <LogoutButton />
        </header>

        <header className="hidden items-center justify-between gap-6 border-b border-[var(--ds-admin-border)] bg-[#080808]/80 px-8 py-4 backdrop-blur lg:flex rtl:flex-row-reverse">
          <AdminLocaleSwitcher />
          <div className="flex items-center gap-4 rtl:flex-row-reverse">
            {emailHint ? (
              <span className="truncate max-w-[220px] text-xs text-neutral-500" title={emailHint}>
                {emailHint}
              </span>
            ) : (
              <span className="text-xs text-neutral-600">{dict.administrator}</span>
            )}
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 rtl:text-right">{children}</main>
      </div>
    </div>
  );
}
