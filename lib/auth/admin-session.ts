import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE } from './admin-cookie';
import { verifyAdminJwt } from './admin-jwt';
import type { AdminJwtClaims } from './admin-jwt';

export async function readAdminJwtFromCookies(): Promise<AdminJwtClaims | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminJwt(token);
}

export async function requireAdminSession(): Promise<AdminJwtClaims> {
  const session = await readAdminJwtFromCookies();
  if (!session) redirect('/admin/login');
  return session;
}
