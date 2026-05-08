import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handler = createMiddleware(routing);

export function proxy(request: Request) {
  return handler(request as Parameters<typeof handler>[0]);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
