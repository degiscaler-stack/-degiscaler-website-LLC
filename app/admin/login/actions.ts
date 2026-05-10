'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { LoginActionState } from '@/lib/admin/login-action-state';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { signAdminJwt } from '@/lib/auth/admin-jwt';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/admin-cookie';

export async function loginAdminAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { code: 'MISSING' };
  }

  let user: { id: string; email: string; passwordHash: string; role: string } | null;
  try {
    user = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, role: true },
    });
  } catch {
    return { code: 'DOWN' };
  }

  if (!user) {
    return { code: 'BAD_CREDENTIALS' };
  }

  try {
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return { code: 'BAD_CREDENTIALS' };
    }
  } catch {
    return { code: 'DOWN' };
  }

  const jwt = await signAdminJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  if (!jwt) {
    console.error('[admin login] Missing JWT_SECRET or signing failed.');
    return { code: 'CONFIG' };
  }

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 12 * 60 * 60,
  });

  redirect('/admin');
}
