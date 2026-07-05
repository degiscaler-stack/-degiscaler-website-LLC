import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth/password';

const STARTER_FEATURES: Prisma.InputJsonValue = [
  'Website Trust Checklist PDF',
  'Homepage Clarity Guide',
  'Basic Checkout Readiness Checklist',
  'Instant Digital Download',
  'PDF Resources Included',
  'Email Delivery Included',
];

const GROWTH_FEATURES: Prisma.InputJsonValue = [
  'Everything in Starter',
  'Conversion Optimization Checklist',
  'Product Page Improvement Guide',
  'Customer Journey Checklist',
  'SEO Basics Resource Pack',
  'Downloadable ZIP Bundle',
];

const PRO_FEATURES: Prisma.InputJsonValue = [
  'Everything in Growth',
  'Business Audit Templates',
  'Email Template Collection',
  'Notion Workflow Resources',
  'Google Sheets Audit Tracker',
  'Premium Optimization Documents',
];

const SCALE_FEATURES: Prisma.InputJsonValue = [
  'Everything in Pro',
  'Full Website Optimization Playbook',
  '90-Day Growth Action Plan',
  'Automation Planning Checklist',
  'Premium Business Templates',
  'Advanced Digital Resource Library',
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
    { key: 'companyName', value: 'DigiScaler', type: 'text' },
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
      slug: 'starter-website-kit',
      title: 'Starter Website Kit',
      subtitle: null,
      price: '€9.99',
      currency: 'EUR',
      description:
        'A compact digital resource pack for improving the basic trust, clarity, and readiness of your website.',
      features: STARTER_FEATURES,
      isPopular: false,
      sortOrder: 0,
    },
    {
      slug: 'growth-optimization-kit',
      title: 'Growth Optimization Kit',
      subtitle: null,
      price: '€19.99',
      currency: 'EUR',
      description:
        'A practical digital toolkit for improving website structure, customer journey clarity, and conversion signals.',
      features: GROWTH_FEATURES,
      isPopular: false,
      sortOrder: 1,
    },
    {
      slug: 'pro-conversion-toolkit',
      title: 'Pro Conversion Toolkit',
      subtitle: null,
      price: '€29.99',
      currency: 'EUR',
      description:
        'A premium bundle of templates and resources for improving website trust, checkout readiness, and customer flow.',
      features: PRO_FEATURES,
      isPopular: true,
      sortOrder: 2,
    },
    {
      slug: 'scale-business-bundle',
      title: 'Scale Business Bundle',
      subtitle: null,
      price: '€49.99',
      currency: 'EUR',
      description:
        'A complete digital resource library for online businesses that want a structured optimization system.',
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
