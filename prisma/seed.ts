import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth/password';

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim()?.toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.warn(
      '[seed] Skipping AdminUser: set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD (not printing values).'
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

async function main() {
  await seedAdmin();
  await seedSiteDefaults();
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
