import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

/** Singleton in dev + production to avoid multiple engines / connection churn on Hostinger. */
export const prisma = globalForPrisma.prisma ?? createClient();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
