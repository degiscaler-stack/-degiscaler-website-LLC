import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * @param {string} command
 * @param {string[]} args
 * @param {import('node:child_process').SpawnSyncOptions} [extraOptions]
 */
function run(command, args, extraOptions = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit',
    // Windows resolves CLI shims (npx.cmd) via the shell; Linux Hostinger uses direct binaries.
    shell: process.platform === 'win32',
    ...extraOptions,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  const code = result.status;
  if (code === null) {
    console.error(`[hostinger-build] Command exited without status: ${command} ${args.join(' ')}`);
    process.exit(1);
  }
  if (code !== 0) {
    process.exit(code);
  }
}

run('npx', ['prisma', 'generate']);

const databaseUrl = process.env.DATABASE_URL?.trim();
if (databaseUrl) {
  run('npx', ['prisma', 'migrate', 'deploy']);
  run('npm', ['run', 'prisma:seed']);
} else {
  console.log(
    '[hostinger-build] DATABASE_URL is not set — skipping prisma migrate deploy and prisma:seed (OK for local/offline builds).'
  );
}

run('npx', ['next', 'build']);
