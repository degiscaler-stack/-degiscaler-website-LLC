import type { ReactNode } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';

type NavTile = {
  label: string;
  href?: string;
  icon: typeof LayoutDashboard;
  comingSoon?: boolean;
};

const navItems: NavTile[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Packages', icon: Package, comingSoon: true },
  { label: 'Services', icon: BriefcaseBusiness, comingSoon: true },
  { label: 'FAQs', icon: HelpCircle, comingSoon: true },
  { label: 'Testimonials', icon: MessageSquareQuote, comingSoon: true },
  { label: 'Pages', icon: FileText, comingSoon: true },
  { label: 'Legal Pages', icon: Scale, comingSoon: true },
  { label: 'Contact Messages', icon: Inbox, comingSoon: true },
  { label: 'Chat Support', icon: MessagesSquare, comingSoon: true },
  { label: 'Settings', icon: Settings, comingSoon: true },
];

export function AdminShell({
  emailHint,
  children,
}: {
  emailHint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--ds-admin-border)] bg-[#080808] lg:flex">
        <div className="border-b border-[var(--ds-admin-border)] px-5 py-4">
          <div className="bg-gradient-to-r from-[#e8cc65] via-[#d6a700] to-[#ff8411] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            DegiScaler
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Admin panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              if (item.comingSoon || !item.href) {
                return (
                  <li key={item.label}>
                    <span className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500">
                      <item.icon className="size-4 shrink-0 opacity-60" aria-hidden />
                      <span className="truncate">{item.label}</span>
                      <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-neutral-600">
                        Soon
                      </span>
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/[0.04] hover:text-white"
                  >
                    <item.icon className="size-4 shrink-0 text-[var(--ds-admin-accent)]" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[var(--ds-admin-border)] px-4 py-3 text-[11px] text-neutral-600">
          <Lock className="mb-1 inline-block size-3 opacity-70" aria-hidden /> Secure area · Phase 1
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-[var(--ds-admin-border)] bg-[#050505]/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-neutral-300">DegiScaler admin</div>
            <div className="truncate text-[11px] text-neutral-600">Limited mobile nav · use desktop</div>
          </div>
          <LogoutButton />
        </header>

        <header className="hidden items-center justify-between gap-6 border-b border-[var(--ds-admin-border)] bg-[#080808]/80 px-8 py-4 backdrop-blur lg:flex">
          <div />
          <div className="flex items-center gap-4">
            {emailHint ? (
              <span className="text-xs text-neutral-500 truncate max-w-[220px]" title={emailHint}>
                {emailHint}
              </span>
            ) : (
              <span className="text-xs text-neutral-600">Administrator</span>
            )}
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
