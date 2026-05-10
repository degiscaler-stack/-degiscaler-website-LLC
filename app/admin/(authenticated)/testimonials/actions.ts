'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

export async function createTestimonialAction(formData: FormData) {
  await requireAdminSession();
  const name = String(formData.get('name') ?? '').trim();
  const roleOrCompany = String(formData.get('roleOrCompany') ?? '').trim() || null;
  const quote = String(formData.get('quote') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isActive = formData.get('isActive') === 'on';

  if (!name || !quote) return;

  try {
    await prisma.testimonial.create({
      data: {
        name,
        roleOrCompany,
        quote,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[createTestimonialAction]', err);
    return;
  }
  revalidatePath('/admin/testimonials');
}

export async function updateTestimonialAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  const name = String(formData.get('name') ?? '').trim();
  const roleOrCompany = String(formData.get('roleOrCompany') ?? '').trim() || null;
  const quote = String(formData.get('quote') ?? '').trim();
  const sortOrder = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  const isActive = formData.get('isActive') === 'on';

  if (!name || !quote) return;

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        roleOrCompany,
        quote,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });
  } catch (err) {
    console.error('[updateTestimonialAction]', err);
    return;
  }
  revalidatePath('/admin/testimonials');
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (err) {
    console.error('[deleteTestimonialAction]', err);
    return;
  }
  revalidatePath('/admin/testimonials');
}
