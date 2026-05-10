'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

function slugOk(s: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}

export async function createSitePageAction(formData: FormData) {
  await requireAdminSession();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isPublished = formData.get('isPublished') === 'on';

  if (!slugOk(slug) || !title || !body) return;

  try {
    await prisma.sitePage.create({
      data: {
        slug,
        title,
        body,
        isPublished,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[createSitePageAction]', err);
    return;
  }
  revalidatePath('/admin/pages');
}

export async function updateSitePageAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isPublished = formData.get('isPublished') === 'on';

  if (!slugOk(slug) || !title || !body) return;

  try {
    await prisma.sitePage.update({
      where: { id },
      data: {
        slug,
        title,
        body,
        isPublished,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[updateSitePageAction]', err);
    return;
  }
  revalidatePath('/admin/pages');
}

export async function deleteSitePageAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  try {
    await prisma.sitePage.delete({ where: { id } });
  } catch (err) {
    console.error('[deleteSitePageAction]', err);
    return;
  }
  revalidatePath('/admin/pages');
}
