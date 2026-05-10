'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

function slugOk(s: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}

export async function createLegalDocumentAction(formData: FormData) {
  await requireAdminSession();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!slugOk(slug) || !title || !body) return;

  try {
    await prisma.legalDocument.create({
      data: { slug, title, body },
    });
  } catch (err) {
    console.error('[createLegalDocumentAction]', err);
    return;
  }
  revalidatePath('/admin/legal-pages');
}

export async function updateLegalDocumentAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!slugOk(slug) || !title || !body) return;

  try {
    await prisma.legalDocument.update({
      where: { id },
      data: { slug, title, body },
    });
  } catch (err) {
    console.error('[updateLegalDocumentAction]', err);
    return;
  }
  revalidatePath('/admin/legal-pages');
}

export async function deleteLegalDocumentAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  try {
    await prisma.legalDocument.delete({ where: { id } });
  } catch (err) {
    console.error('[deleteLegalDocumentAction]', err);
    return;
  }
  revalidatePath('/admin/legal-pages');
}
