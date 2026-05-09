'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/admin-cookie';

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
