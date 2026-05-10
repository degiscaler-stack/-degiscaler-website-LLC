import { Buffer } from 'node:buffer';
import { isValidEmail } from '@/lib/validation/email';
import { SUPPORT_ATTACHMENT_MAX_BYTES } from '@/lib/support/attachment-limits';

export const SUPPORT_SESSION_STORAGE_KEY = 'degiscaler-support-session-id';

const STATUSES = ['OPEN', 'WAITING', 'CLOSED'] as const;

export { SUPPORT_ATTACHMENT_MAX_BYTES };

export type ParsedSupportAttachment = {
  attachmentUrl: string;
  attachmentName: string | null;
  attachmentType: string;
};

export function trimStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export function isAllowedConversationStatus(s: string): s is (typeof STATUSES)[number] {
  return (STATUSES as readonly string[]).includes(s);
}

function safeAttachmentName(raw: string): string | null {
  if (!raw) return null;
  const base = raw.split(/[/\\]/).pop() ?? raw;
  const s = base.slice(0, 120).trim();
  return s.length ? s : null;
}

/** Validates optional data-URL image (jpeg/png/webp); rejects SVG and oversized payloads */
export function parseOptionalAttachment(body: Record<string, unknown>): { ok: false; error: string } | { ok: true; value: ParsedSupportAttachment | null } {
  const urlRaw = trimStr(body.attachmentUrl);
  const nameRaw = trimStr(body.attachmentName);

  if (!urlRaw && !nameRaw) {
    return { ok: true, value: null };
  }

  if (!urlRaw && nameRaw) {
    return { ok: false, error: 'attachment_invalid' };
  }

  if (!urlRaw.startsWith('data:')) {
    return { ok: false, error: 'attachment_invalid' };
  }

  const match = urlRaw.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([\s\S]+)$/i);
  if (!match) {
    return { ok: false, error: 'attachment_invalid' };
  }

  const mimeRaw = match[1].toLowerCase();
  const normalizedMime = mimeRaw === 'image/jpg' ? 'image/jpeg' : mimeRaw;

  let buf: Buffer;
  try {
    buf = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  } catch {
    return { ok: false, error: 'attachment_invalid' };
  }

  if (!buf.length || buf.length > SUPPORT_ATTACHMENT_MAX_BYTES) {
    return { ok: false, error: 'attachment_too_large' };
  }

  return {
    ok: true,
    value: {
      attachmentUrl: urlRaw,
      attachmentName: safeAttachmentName(nameRaw),
      attachmentType: normalizedMime,
    },
  };
}

export function validateSupportCreateBody(input: {
  sessionId?: unknown;
  fullName?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  message?: unknown;
  locale?: unknown;
  attachmentUrl?: unknown;
  attachmentName?: unknown;
  attachmentType?: unknown;
}): { ok: false; error: string } | {
  ok: true;
  sessionId: string | undefined;
  fullName: string;
  email: string;
  whatsapp: string | null;
  message: string;
  locale: string;
  attachment: ParsedSupportAttachment | null;
} {
  const sessionIdRaw = trimStr(input.sessionId);
  const fullName = trimStr(input.fullName);
  const email = trimStr(input.email);
  const whatsappRaw = trimStr(input.whatsapp);
  const message = trimStr(input.message);
  const localeRaw = trimStr(input.locale).toLowerCase() || 'en';

  if (!fullName) return { ok: false, error: 'fullName_required' };
  if (!email || !isValidEmail(email)) return { ok: false, error: 'email_invalid' };

  const parsedAtt = parseOptionalAttachment(input as Record<string, unknown>);
  if (!parsedAtt.ok) return parsedAtt;

  if (!message && !parsedAtt.value) {
    return { ok: false, error: 'message_required' };
  }

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
    attachment: parsedAtt.value,
  };
}

export function validateVisitorMessageBody(input: {
  sessionId?: unknown;
  message?: unknown;
  attachmentUrl?: unknown;
  attachmentName?: unknown;
  attachmentType?: unknown;
}): { ok: false; error: string } | {
  ok: true;
  sessionId: string;
  message: string;
  attachment: ParsedSupportAttachment | null;
} {
  const sessionId = trimStr(input.sessionId);
  const message = trimStr(input.message);

  if (!sessionId) return { ok: false, error: 'session_required' };

  const parsedAtt = parseOptionalAttachment(input as Record<string, unknown>);
  if (!parsedAtt.ok) return parsedAtt;

  if (!message && !parsedAtt.value) {
    return { ok: false, error: 'message_required' };
  }

  return { ok: true, sessionId, message, attachment: parsedAtt.value };
}
