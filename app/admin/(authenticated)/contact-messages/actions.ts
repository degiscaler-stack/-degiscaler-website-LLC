'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

const CONTACT_STATUSES = ['NEW', 'REPLIED', 'CLOSED'] as const;

export async function updateContactStatusAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!id || !CONTACT_STATUSES.includes(status as (typeof CONTACT_STATUSES)[number])) return;

  await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/contact-messages');
}
