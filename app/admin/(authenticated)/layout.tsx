import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  applyAdminSeenSideEffects,
  getAdminSidebarCounts,
  readAdminRouteFromHeaders,
} from '@/lib/admin/notification-counts';

export const dynamic = 'force-dynamic';

export default async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  const emailHint = typeof session.email === 'string' ? session.email : undefined;

  const hdrs = await headers();
  const route = readAdminRouteFromHeaders((name) => hdrs.get(name));
  await applyAdminSeenSideEffects({ path: route.path, chatThreadId: route.chatThreadId });
  const sidebarCounts = await getAdminSidebarCounts();

  return (
    <AdminShell emailHint={emailHint} sidebarCounts={sidebarCounts}>
      {children}
    </AdminShell>
  );
}
