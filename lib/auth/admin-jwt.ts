import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

const COOKIE_TOKEN_HOURS = 12;

export type AdminJwtClaims = JWTPayload & {
  sub: string;
  email?: string;
  role?: string;
};

function secretKey(): Uint8Array | null {
  const s = process.env.JWT_SECRET;
  if (!s || s.trim() === '') {
    return null;
  }
  return new TextEncoder().encode(s);
}

export async function signAdminJwt(payload: {
  sub: string;
  email: string;
  role: string;
}): Promise<string | null> {
  const key = secretKey();
  if (!key) return null;

  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + COOKIE_TOKEN_HOURS * 3600)
    .sign(key);
}

export async function verifyAdminJwt(token: string): Promise<AdminJwtClaims | null> {
  const key = secretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    if (typeof payload.sub !== 'string' || payload.sub === '') {
      return null;
    }
    return payload as AdminJwtClaims;
  } catch {
    return null;
  }
}
