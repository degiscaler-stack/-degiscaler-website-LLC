'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

export async function createFaqAction(formData: FormData) {
  await requireAdminSession();
  const question = String(formData.get('question') ?? '').trim();
  const answer = String(formData.get('answer') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isActive = formData.get('isActive') === 'on';

  if (!question || !answer) return;

  try {
    await prisma.faq.create({
      data: {
        question,
        answer,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[createFaqAction]', err);
    return;
  }
  revalidatePath('/admin/faqs');
}

export async function updateFaqAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  const question = String(formData.get('question') ?? '').trim();
  const answer = String(formData.get('answer') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isActive = formData.get('isActive') === 'on';

  if (!question || !answer) return;

  try {
    await prisma.faq.update({
      where: { id },
      data: {
        question,
        answer,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[updateFaqAction]', err);
    return;
  }
  revalidatePath('/admin/faqs');
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  try {
    await prisma.faq.delete({ where: { id } });
  } catch (err) {
    console.error('[deleteFaqAction]', err);
    return;
  }
  revalidatePath('/admin/faqs');
}
