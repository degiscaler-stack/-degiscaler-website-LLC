export const runtime = 'nodejs';

import { DEPLOY_BUILT_AT, DEPLOY_COMMIT } from '@/lib/deploy-info';

export function GET() {
  return Response.json({
    ok: true,
    service: 'degiscaler',
    commit: DEPLOY_COMMIT,
    builtAt: DEPLOY_BUILT_AT || null,
    time: new Date().toISOString(),
  });
}
