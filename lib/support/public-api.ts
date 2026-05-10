import { isValidEmail } from '@/lib/validation/email';

export const SUPPORT_SESSION_STORAGE_KEY = 'degiscaler-support-session-id';

const STATUSES = ['OPEN', 'WAITING', 'CLOSED'] as const;

export function trimStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export function isAllowedConversationStatus(s: string): s is (typeof STATUSES)[number] {
  return (STATUSES as readonly string[]).includes(s);
}

export function validateSupportCreateBody(input: {
  sessionId?: unknown;
  fullName?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  message?: unknown;
  locale?: unknown;
}): { ok: false; error: string } | {
  ok: true;
  sessionId: string | undefined;
  fullName: string;
  email: string;
  whatsapp: string | null;
  message: string;
  locale: string;
} {
  const sessionIdRaw = trimStr(input.sessionId);
  const fullName = trimStr(input.fullName);
  const email = trimStr(input.email);
  const whatsappRaw = trimStr(input.whatsapp);
  const message = trimStr(input.message);
  const localeRaw = trimStr(input.locale).toLowerCase() || 'en';

  if (!fullName) return { ok: false, error: 'fullName_required' };
  if (!email || !isValidEmail(email)) return { ok: false, error: 'email_invalid' };
  if (!message) return { ok: false, error: 'message_required' };

  const locale = localeRaw === 'ar' || localeRaw === 'fr' ? localeRaw : 'en';
  const whatsapp = whatsappRaw.length ? whatsappRaw : null;

  return {
    ok: true,
    sessionId: sessionIdRaw.length ? sessionIdRaw : undefined,
    fullName,
    email,
    whatsapp,
    message,
    locale,
  };
}

export function validateVisitorMessageBody(input: {
  sessionId?: unknown;
  message?: unknown;
}): { ok: false; error: string } | { ok: true; sessionId: string; message: string } {
  const sessionId = trimStr(input.sessionId);
  const message = trimStr(input.message);
  if (!sessionId) return { ok: false, error: 'session_required' };
  if (!message) return { ok: false, error: 'message_required' };
  return { ok: true, sessionId, message };
}
