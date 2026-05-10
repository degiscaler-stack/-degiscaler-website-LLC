'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth/admin-session';

const ALLOWED_KEYS = new Set(['siteUrl', 'supportEmail', 'companyName', 'chatbotEnabled', 'defaultLocale']);

export async function upsertSiteSettingAction(formData: FormData) {
  await requireAdminSession();
  const key = String(formData.get('key') ?? '').trim();
  if (!ALLOWED_KEYS.has(key)) return;

  let value = '';
  if (key === 'chatbotEnabled') {
    const flags = formData.getAll('enabled');
    const enabled = flags.includes('true') || flags.includes('on');
    value = enabled ? 'true' : 'false';
  } else {
    value = String(formData.get('value') ?? '').trim();
    if (!value && key !== 'defaultLocale' && key !== 'siteUrl') return;
  }

  try {
    await prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value,
        type: key === 'chatbotEnabled' ? 'boolean' : 'text',
      },
      update: { value },
    });
  } catch (err) {
    console.error('[upsertSiteSettingAction]', err);
    return;
  }
  revalidatePath('/admin/settings');
}
