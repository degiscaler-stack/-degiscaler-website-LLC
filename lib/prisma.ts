import type { PrismaClient } from '@prisma/client';
import { createRequire } from 'node:module';

/** Deferred native `@prisma/client` load — avoids engine startup unless something touches `prisma.*`. */
const require = createRequire(import.meta.url);
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createDb(): PrismaClient {
  const mod = require('@prisma/client') as typeof import('@prisma/client');
  const Client = mod.PrismaClient;
  return new Client({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createDb();
  }
  return globalForPrisma.prisma;
}

/** Singleton proxy — Prisma engine loads on first property access, not at module import. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
}) as PrismaClient;
