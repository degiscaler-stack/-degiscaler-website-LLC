/**
 * Hostinger Linux extracts Prisma engine binaries without the Unix execute bit.
 * `prisma generate` / `migrate deploy` then fail with EACCES on
 * schema-engine-debian-openssl-1.1.x. Restore +x before any Prisma CLI spawn.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const ENGINE_FILE =
  /^(schema-engine|query-engine|migration-engine|introspection-engine|prisma-fmt|libquery_engine)/i;

/**
 * @param {string} dir
 * @param {number} [depth]
 */
function chmodEngineFiles(dir, depth = 0) {
  if (depth > 8 || !fs.existsSync(dir)) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      chmodEngineFiles(full, depth + 1);
      continue;
    }
    if (!ent.isFile()) continue;
    if (!ENGINE_FILE.test(ent.name)) continue;
    try {
      fs.chmodSync(full, 0o755);
      console.log(`[prisma-engines] chmod 755 ${path.relative(rootDir, full)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[prisma-engines] chmod failed ${full}: ${message}`);
    }
  }
}

export function ensurePrismaEnginesExecutable() {
  if (process.platform === 'win32') {
    return;
  }
  chmodEngineFiles(path.join(rootDir, 'node_modules', '@prisma'));
  chmodEngineFiles(path.join(rootDir, 'node_modules', 'prisma'));
  chmodEngineFiles(path.join(rootDir, 'node_modules', '.prisma'));
}

ensurePrismaEnginesExecutable();
