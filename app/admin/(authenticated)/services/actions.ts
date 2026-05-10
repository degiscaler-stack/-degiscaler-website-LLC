'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

function slugOk(s: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}

export async function createServiceAction(formData: FormData) {
  await requireAdminSession();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const shortDescription = String(formData.get('shortDescription') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isActive = formData.get('isActive') === 'on';

  if (!slugOk(slug) || !title || !description) return;

  try {
    await prisma.service.create({
      data: {
        slug,
        title,
        shortDescription,
        description,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[createServiceAction]', err);
    return;
  }
  revalidatePath('/admin/services');
}

export async function updateServiceAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const shortDescription = String(formData.get('shortDescription') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isActive = formData.get('isActive') === 'on';

  if (!slugOk(slug) || !title || !description) return;

  try {
    await prisma.service.update({
      where: { id },
      data: {
        slug,
        title,
        shortDescription,
        description,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[updateServiceAction]', err);
    return;
  }
  revalidatePath('/admin/services');
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  try {
    await prisma.service.delete({ where: { id } });
  } catch (err) {
    console.error('[deleteServiceAction]', err);
    return;
  }
  revalidatePath('/admin/services');
}
