import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth/password';

const STARTER_FEATURES: Prisma.InputJsonValue = [
  '30-minute live consultation call',
  'Website credibility review',
  'Online presence clarity check',
  '3 key improvement recommendations',
  'Email recap after the call',
  'Scheduled within 48 business hours',
];

const GROWTH_FEATURES: Prisma.InputJsonValue = [
  '45-minute live consultation call',
  'Website and checkout review',
  'Customer journey clarity check',
  '5 improvement recommendations',
  'Trust signal assessment',
  'Scheduled within 2-3 business days',
];

const PRO_FEATURES: Prisma.InputJsonValue = [
  '60-minute live consultation call',
  'Full website and UX review',
  'Checkout clarity assessment',
  'Payment-readiness review',
  'Action plan discussed on call',
  'Detailed email recap after the call',
];

const SCALE_FEATURES: Prisma.InputJsonValue = [
  '90-minute live strategy call',
  'Full website and funnel review',
  'Trust and conversion clarity review',
  'Checkout and payment flow review',
  'Priority action plan discussed on call',
  'Detailed email recap after the call',
];

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim()?.toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.warn(
      '[seed] Skipping AdminUser: set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD (not printing values).',
    );
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.warn('[seed] Admin user already exists for this email. Skipping create.');
    return;
  }

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.create({
    data: { email, passwordHash, role: 'ADMIN', name: 'Admin' },
  });
  console.warn('[seed] Admin user created (password not logged).');
}

async function seedSiteDefaults() {
  const defaults = [
    { key: 'siteUrl', value: 'https://degiscaler.com', type: 'text' },
    { key: 'supportEmail', value: 'support@degiscaler.com', type: 'text' },
    { key: 'companyName', value: 'DegiScaler', type: 'text' },
    { key: 'defaultLocale', value: 'en', type: 'text' },
    { key: 'chatbotEnabled', value: 'true', type: 'boolean' },
  ] as const;

  for (const row of defaults) {
    const found = await prisma.siteSetting.findUnique({ where: { key: row.key } });
    if (found) continue;
    await prisma.siteSetting.create({
      data: { key: row.key, value: row.value, type: row.type },
    });
    console.warn(`[seed] SiteSetting '${row.key}' created.`);
  }
}

async function seedPackages() {
  const packs: Array<{
    slug: string;
    title: string;
    subtitle: string | null;
    price: string;
    currency: string;
    description: string;
    features: Prisma.InputJsonValue;
    isPopular: boolean;
    sortOrder: number;
  }> = [
    {
      slug: 'starter-consultation',
      title: 'Starter Consultation',
      subtitle: null,
      price: '$9.99',
      currency: 'USD',
      description:
        'A focused live consultation for founders who need a quick review of their website and online presence.',
      features: STARTER_FEATURES,
      isPopular: false,
      sortOrder: 0,
    },
    {
      slug: 'growth-consultation',
      title: 'Growth Consultation',
      subtitle: null,
      price: '$19.99',
      currency: 'USD',
      description:
        'A structured live consultation to improve website clarity, checkout flow, trust signals, and customer journey.',
      features: GROWTH_FEATURES,
      isPopular: false,
      sortOrder: 1,
    },
    {
      slug: 'pro-consultation',
      title: 'Pro Consultation',
      subtitle: null,
      price: '$29.99',
      currency: 'USD',
      description:
        'A complete live consultation covering website UX, checkout clarity, trust signals, and payment readiness.',
      features: PRO_FEATURES,
      isPopular: true,
      sortOrder: 2,
    },
    {
      slug: 'scale-consultation',
      title: 'Scale Consultation',
      subtitle: null,
      price: '$49.99',
      currency: 'USD',
      description:
        'A premium strategy consultation for deeper review of your digital presence, funnel, trust, and priorities.',
      features: SCALE_FEATURES,
      isPopular: false,
      sortOrder: 3,
    },
  ];

  for (const p of packs) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        price: p.price,
        currency: p.currency,
        description: p.description,
        features: p.features,
        isPopular: p.isPopular,
        isActive: true,
        sortOrder: p.sortOrder,
      },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        price: p.price,
        currency: p.currency,
        description: p.description,
        features: p.features,
        isPopular: p.isPopular,
        isActive: true,
        sortOrder: p.sortOrder,
      },
    });
    console.warn(`[seed] Package '${p.slug}' upserted.`);
  }

  const legacy = await prisma.package.updateMany({
    where: {
      slug: { in: ['advanced-consultation', 'elite-launch-package'] },
    },
    data: { isActive: false, isPopular: false },
  });
  if (legacy.count > 0) {
    console.warn(`[seed] Deactivated ${legacy.count} legacy package row(s).`);
  }
}

async function main() {
  await seedAdmin();
  await seedSiteDefaults();
  await seedPackages();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
