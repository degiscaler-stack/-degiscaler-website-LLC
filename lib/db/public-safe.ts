import type { Package, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export function isDatabaseConfigured(): boolean {
  return typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0;
}

/** Active packages for public pricing/order UI; never throws. */
export async function safeFindPackages(): Promise<Package[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
  } catch (err) {
    console.error('[safeFindPackages]', err);
    return [];
  }
}

export async function safeCreateOrder(
  data: Prisma.OrderUncheckedCreateInput,
): Promise<{ ok: true } | { ok: false }> {
  if (!isDatabaseConfigured()) {
    console.error('[safeCreateOrder] DATABASE_URL is not configured');
    return { ok: false };
  }
  try {
    await prisma.order.create({ data });
    return { ok: true };
  } catch (err) {
    console.error('[safeCreateOrder]', err);
    return { ok: false };
  }
}

export async function safeCreateContactMessage(
  data: Prisma.ContactMessageUncheckedCreateInput,
): Promise<{ ok: true } | { ok: false }> {
  if (!isDatabaseConfigured()) {
    console.error('[safeCreateContactMessage] DATABASE_URL is not configured');
    return { ok: false };
  }
  try {
    await prisma.contactMessage.create({ data });
    return { ok: true };
  } catch (err) {
    console.error('[safeCreateContactMessage]', err);
    return { ok: false };
  }
}

/** Single-package lookup; never throws. */
export async function safeFindPackageBySlug(slug: string) {
  if (!isDatabaseConfigured()) return null;
  const trimmed = slug.trim();
  if (!trimmed) return null;
  try {
    return await prisma.package.findFirst({
      where: { slug: trimmed, isActive: true },
    });
  } catch (err) {
    console.error('[safeFindPackageBySlug]', err);
    return null;
  }
}
