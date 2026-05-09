'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { signAdminJwt } from '@/lib/auth/admin-jwt';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/admin-cookie';

export type LoginActionState = { error: string | null };

export async function loginAdminAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  let user: { id: string; email: string; passwordHash: string; role: string } | null;
  try {
    user = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, role: true },
    });
  } catch {
    return { error: 'Unable to sign in right now.' };
  }

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  try {
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return { error: 'Invalid email or password.' };
    }
  } catch {
    return { error: 'Unable to sign in right now.' };
  }

  const jwt = await signAdminJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  if (!jwt) {
    console.error('[admin login] Missing JWT_SECRET or signing failed.');
    return { error: 'Server configuration error. Try again later.' };
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
