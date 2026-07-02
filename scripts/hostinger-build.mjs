import { spawnSync, execSync } from 'node:child_process';
import fs from 'node:fs';
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

let deployCommit = 'unknown';
try {
  deployCommit = execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
} catch {
  // Non-git environments (e.g. some CI snapshots) — health still works.
}

fs.writeFileSync(
  path.join(rootDir, 'lib', 'deploy-info.ts'),
  [
    '// Generated at build time by scripts/hostinger-build.mjs — do not edit.',
    `export const DEPLOY_COMMIT = ${JSON.stringify(deployCommit)};`,
    `export const DEPLOY_BUILT_AT = ${JSON.stringify(new Date().toISOString())};`,
    '',
  ].join('\n'),
);

run('npx', ['next', 'build']);
