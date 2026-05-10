'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

export async function replySupportAction(formData: FormData) {
  await requireAdminSession();
  const conversationId = String(formData.get('conversationId') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!conversationId || !body) return;

  await prisma.supportMessage.create({
    data: {
      conversationId,
      sender: 'ADMIN',
      body,
    },
  });
  await prisma.supportConversation.update({
    where: { id: conversationId },
    data: { adminSeenAt: new Date() },
  });
  revalidatePath('/admin');
  revalidatePath('/admin/chat-support');
}

export async function updateSupportConversationStatusAction(formData: FormData) {
  await requireAdminSession();
  const conversationId = String(formData.get('conversationId') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!conversationId || !['OPEN', 'WAITING', 'CLOSED'].includes(status)) return;

  await prisma.supportConversation.update({
    where: { id: conversationId },
    data: { status, adminSeenAt: new Date() },
  });
  revalidatePath('/admin');
  revalidatePath('/admin/chat-support');
}
