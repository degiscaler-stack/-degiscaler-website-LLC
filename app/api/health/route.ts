import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const databaseUrlSet =
    typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0;
  const jwtSecretSet =
    typeof process.env.JWT_SECRET === 'string' && process.env.JWT_SECRET.trim().length > 0;

  let dbOk = false;
  let dbError: string | undefined;

  try {
    if (!databaseUrlSet) {
      dbError = 'not_configured';
    } else {
      try {
        const { prisma } = await import('@/lib/prisma');
        await prisma.$queryRaw`SELECT 1`;
        dbOk = true;
      } catch {
        dbError = 'unavailable';
      }
    }
  } catch {
    dbError = 'unavailable';
  }

  return NextResponse.json({
    ok: true,
    env: {
      databaseUrlSet,
      jwtSecretSet,
    },
    db: {
      ok: dbOk,
      ...(dbError ? { error: dbError } : {}),
    },
  });
}
