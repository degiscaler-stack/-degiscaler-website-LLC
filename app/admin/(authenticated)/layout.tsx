import type { ReactNode } from 'react';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  const emailHint = typeof session.email === 'string' ? session.email : undefined;

  return <AdminShell emailHint={emailHint}>{children}</AdminShell>;
}
