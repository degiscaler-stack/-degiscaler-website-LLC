'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

const ORDER_STATUSES = ['NEW', 'CONTACTED', 'CLOSED'] as const;

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!id || !ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) return;

  await prisma.order.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/orders');
}
