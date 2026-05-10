'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

function parseFeatures(raw: string): Prisma.InputJsonValue {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines;
}

function slugOk(s: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}

export async function createPackageAction(formData: FormData) {
  await requireAdminSession();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const subtitleRaw = String(formData.get('subtitle') ?? '').trim();
  const price = String(formData.get('price') ?? '').trim();
  const currency = String(formData.get('currency') ?? '').trim() || 'USD';
  const description = String(formData.get('description') ?? '').trim();
  const featuresRaw = String(formData.get('features') ?? '');
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isPopular = formData.get('isPopular') === 'on';
  const isActive = formData.get('isActive') === 'on';

  if (!slugOk(slug) || !title || !price || !description) {
    return;
  }

  await prisma.package.create({
    data: {
      slug,
      title,
      subtitle: subtitleRaw || null,
      price,
      currency,
      description,
      features: parseFeatures(featuresRaw),
      isPopular,
      isActive,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  });
  revalidatePath('/admin/packages');
}

export async function updatePackageAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const title = String(formData.get('title') ?? '').trim();
  const subtitleRaw = String(formData.get('subtitle') ?? '').trim();
  const price = String(formData.get('price') ?? '').trim();
  const currency = String(formData.get('currency') ?? '').trim() || 'USD';
  const description = String(formData.get('description') ?? '').trim();
  const featuresRaw = String(formData.get('features') ?? '');
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isPopular = formData.get('isPopular') === 'on';
  const isActive = formData.get('isActive') === 'on';

  if (!slugOk(slug) || !title || !price || !description) return;

  await prisma.package.update({
    where: { id },
    data: {
      slug,
      title,
      subtitle: subtitleRaw || null,
      price,
      currency,
      description,
      features: parseFeatures(featuresRaw),
      isPopular,
      isActive,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  });
  revalidatePath('/admin/packages');
}

export async function deletePackageAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const pkg = await prisma.package.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!pkg) return;

  const linked = await prisma.order.count({
    where: {
      OR: [{ packageId: id }, { packageSlug: pkg.slug }],
    },
  });
  if (linked > 0) {
    redirect('/admin/packages?deleteBlocked=1');
  }

  try {
    await prisma.package.delete({ where: { id } });
  } catch {
    return;
  }
  revalidatePath('/admin/packages');
}
