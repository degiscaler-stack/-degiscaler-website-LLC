import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth/password';

const STARTER_FEATURES: Prisma.InputJsonValue = [
  '30-minute digital consultation',
  'Website credibility review',
  '3 key improvement recommendations',
  'Written summary delivered by email',
  'Response within 48 business hours',
];

const GROWTH_FEATURES: Prisma.InputJsonValue = [
  '45-minute digital consultation',
  'Website and checkout review',
  '5 improvement recommendations',
  'Trust signal assessment',
  'Written report delivered by email',
];

const PRO_FEATURES: Prisma.InputJsonValue = [
  '60-minute digital consultation',
  'Full website and UX review',
  'Checkout clarity assessment',
  'Payment-readiness review',
  'Detailed written report with action plan',
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
        'A focused entry-level consultation for founders who need a quick professional assessment of their online presence.',
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
        'A structured consultation for businesses looking to improve their online presence and customer journey.',
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
        'A comprehensive consultation covering your full digital presence and payment-readiness.',
      features: PRO_FEATURES,
      isPopular: true,
      sortOrder: 2,
    },
  ];

  for (const p of packs) {
    const exists = await prisma.package.findUnique({ where: { slug: p.slug } });
    if (exists) continue;
    await prisma.package.create({
      data: {
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
    });
    console.warn(`[seed] Package '${p.slug}' created.`);
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
