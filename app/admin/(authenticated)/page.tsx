import { LayoutDashboard, Boxes, Puzzle, Inbox, MessagesSquare } from 'lucide-react';

export default function AdminOverviewPage() {
  const placeholders = [
    { title: 'Packages', subtitle: 'Coming soon · Phase 2', icon: Boxes },
    { title: 'Services', subtitle: 'Coming soon · Phase 2', icon: Puzzle },
    { title: 'Messages', subtitle: 'No inbox yet · Phase 2', icon: Inbox },
    {
      title: 'Chat Conversations',
      subtitle: 'Support dashboard · Phase 2',
      icon: MessagesSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <LayoutDashboard className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          Overview
        </h1>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl">
          Phase 1 is live: authentication and dashboard shell only. Manage content modules will
          unlock in upcoming phases.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {placeholders.map(({ title, subtitle, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-neutral-200">{title}</p>
                <p className="mt-2 text-xs text-neutral-500">{subtitle}</p>
              </div>
              <Icon className="size-6 shrink-0 text-[var(--ds-admin-accent)] opacity-85" aria-hidden />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-6 text-center text-sm text-neutral-500">
        CMS builders, FAQs, testimonials, legal pages editor, chat support inbox, and site
        settings are marked as &ldquo;Coming soon&rdquo; in the sidebar — not implemented yet in
        this phase.
      </div>
    </div>
  );
}
