'use client';

/**
 * DigiScaler rule-based chat (client). FAQ answers and product support handoff via /api/support/*.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, ImagePlus } from 'lucide-react';
import { matchIntent, normalizeUserMessage, shouldStartSupportFlow } from '@/lib/chat/ruleMatcher';
import type { BotIntent } from '@/lib/chat/knowledge';
import ChatLauncher from '@/components/chat/ChatLauncher';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { SUPPORT_SESSION_STORAGE_KEY } from '@/lib/support/public-api';
import { assignSupportAgent } from '@/lib/support/assign-agent';
import { SUPPORT_ATTACHMENT_MAX_BYTES } from '@/lib/support/attachment-limits';

type ChatBubble = {
  id: string;
  role: 'user' | 'bot' | 'agent';
  text: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
};

type SupportPhase =
  | 'idle'
  | 'awaiting_name'
  | 'awaiting_email'
  | 'awaiting_whatsapp'
  | 'awaiting_message';

type ApiMsg = {
  id: string;
  sender: string;
  body: string;
  createdAt?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
};

const LS_PREFIX = 'degiscaler-chat-v1';

function randomDelay(msMin: number, msMax: number) {
  return Math.floor(msMin + Math.random() * (msMax - msMin));
}

function delayForAnswer(text: string, pace: 'default' | 'support') {
  if (pace === 'support') return randomDelay(1500, 2600);
  const len = text.length;
  if (len < 180) return randomDelay(1200, 2000);
  return randomDelay(2000, 3200);
}

function storageKey(locale: string) {
  return `${LS_PREFIX}-${locale}`;
}

function loadPersisted(locale: string): { messages: ChatBubble[]; hasWelcomed: boolean } {
  if (typeof window === 'undefined') return { messages: [], hasWelcomed: false };
  try {
    const raw = window.localStorage.getItem(storageKey(locale));
    if (!raw) return { messages: [], hasWelcomed: false };
    const data = JSON.parse(raw) as { messages?: ChatBubble[]; hasWelcomed?: boolean };
    const messages = Array.isArray(data.messages)
      ? data.messages.filter(
          (m) =>
            m &&
            (m.role === 'user' || m.role === 'bot' || m.role === 'agent') &&
            typeof m.text === 'string',
        )
      : [];
    return {
      messages,
      hasWelcomed: Boolean(data.hasWelcomed) || messages.length > 0,
    };
  } catch {
    return { messages: [], hasWelcomed: false };
  }
}

function isPlausibleEmail(s: string) {
  const t = s.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function isSkipWhatsapp(raw: string): boolean {
  const t = normalizeUserMessage(raw);
  return (
    t === 'skip' ||
    t === 'none' ||
    t === 'no' ||
    t === '-' ||
    t === 'n/a' ||
    t === 'na' ||
    t === 'pas' ||
    t === 'لا' ||
    t.includes('تخطي') ||
    t.includes('لا واتساب') ||
    t.includes('بدون واتساب') ||
    t.includes('no whatsapp') ||
    t.includes('sans whatsapp')
  );
}

function isAllowedVisitorImageMime(mime: string): boolean {
  const m = mime.toLowerCase();
  return m === 'image/jpeg' || m === 'image/png' || m === 'image/webp';
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('read_failed'));
    reader.readAsDataURL(file);
  });
}

/** Quick client check before POST — mirrors server prefix whitelist */
function isLikelySafeImageDataUrl(url: string): boolean {
  return /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(url);
}

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = 'en';
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const welcomeLock = useRef(false);

  const gidHeader = useId().replace(/:/g, '');
  const gidLauncher = useId().replace(/:/g, '');
  const headerGradientId = `chg-h-${gidHeader}`;
  const launcherGradientId = `chg-l-${gidLauncher}`;

  const [storeReady, setStoreReady] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelReveal, setPanelReveal] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [supportPhase, setSupportPhase] = useState<SupportPhase>('idle');
  const [supportDraft, setSupportDraft] = useState<{
    name?: string;
    email?: string;
    whatsapp?: string | null;
  }>({});
  const [supportSessionId, setSupportSessionId] = useState<string | null>(null);
  const [supportActive, setSupportActive] = useState(false);
  const [pendingPick, setPendingPick] = useState<{ file: File; previewUrl: string } | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assignedAgent = useMemo(
    () => (supportSessionId ? assignSupportAgent(supportSessionId) : null),
    [supportSessionId],
  );

  const supportIdentity = useMemo(() => {
    if (!supportActive || !assignedAgent) return null;
    return {
      agentName: assignedAgent.name,
      agentImageSrc: assignedAgent.imageSrc,
      teamLabel: t('support.teamLabel'),
      onlineLabel: t('support.onlineLabel'),
      note: t('support.handoffNote'),
    };
  }, [supportActive, assignedAgent, t]);

  const mapRemoteRow = useCallback(
    (m: ApiMsg): ChatBubble => {
      if (m.sender === 'ADMIN') {
        return {
          id: m.id,
          role: 'agent',
          text: `${t('support.agentPrefix')}${m.body}`,
          attachmentUrl: m.attachmentUrl ?? null,
          attachmentName: m.attachmentName ?? null,
        };
      }
      if (m.sender === 'VISITOR') {
        return {
          id: m.id,
          role: 'user',
          text: m.body,
          attachmentUrl: m.attachmentUrl ?? null,
          attachmentName: m.attachmentName ?? null,
        };
      }
      return { id: m.id, role: 'bot', text: m.body };
    },
    [t],
  );

  const mergeRemoteMessages = useCallback(
    (rows: ApiMsg[]) => {
      setMessages((prev) => {
        let next = [...prev];
        for (const r of rows) {
          if (next.some((m) => m.id === r.id)) continue;
          const bubble = mapRemoteRow(r);
          if (bubble.role === 'user') {
            const idx = next.findLastIndex((m) => {
              if (!(m.role === 'user' && m.id.startsWith('u-'))) return false;
              if (m.text !== bubble.text) return false;
              return Boolean(m.attachmentUrl) === Boolean(bubble.attachmentUrl);
            });
            if (idx !== -1) {
              next = [...next.slice(0, idx), bubble, ...next.slice(idx + 1)];
              continue;
            }
          }
          next = [...next, bubble];
        }
        return next;
      });
    },
    [mapRemoteRow],
  );

  const persist = useCallback(() => {
    if (typeof window === 'undefined' || !storeReady) return;
    try {
      const slim = messages.map(({ attachmentUrl: _a, attachmentName: _n, ...rest }) => rest);
      window.localStorage.setItem(
        storageKey(locale),
        JSON.stringify({ v: 2, messages: slim, hasWelcomed }),
      );
    } catch {
      /* ignore */
    }
  }, [locale, messages, hasWelcomed, storeReady]);

  useEffect(() => {
    welcomeLock.current = false;
    const { messages: m, hasWelcomed: w } = loadPersisted(locale);
    setMessages(m);
    setHasWelcomed(w);
    setStoreReady(true);
    try {
      const sid = window.localStorage.getItem(SUPPORT_SESSION_STORAGE_KEY);
      if (sid) {
        setSupportSessionId(sid);
        setSupportActive(true);
      }
    } catch {
      /* ignore */
    }
  }, [locale]);

  useEffect(() => {
    if (!supportSessionId || !storeReady) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/support/conversation?sessionId=${encodeURIComponent(supportSessionId)}`,
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { ok?: boolean; messages?: ApiMsg[] };
        if (!data.ok || !Array.isArray(data.messages)) return;
        mergeRemoteMessages(data.messages);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supportSessionId, storeReady, mergeRemoteMessages]);

  useEffect(() => {
    if (!storeReady) return;
    const tmr = window.setTimeout(persist, 320);
    return () => window.clearTimeout(tmr);
  }, [messages, hasWelcomed, persist, storeReady]);

  useEffect(() => {
    if (!open || !supportSessionId) return;
    const poll = window.setInterval(async () => {
      try {
        const res = await fetch(
          `/api/support/conversation?sessionId=${encodeURIComponent(supportSessionId)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as { ok?: boolean; messages?: ApiMsg[] };
        if (data.ok && Array.isArray(data.messages)) mergeRemoteMessages(data.messages);
      } catch {
        /* ignore */
      }
    }, 8000);
    return () => clearInterval(poll);
  }, [open, supportSessionId, mergeRemoteMessages]);

  useEffect(() => {
    if (!open) {
      setPanelReveal(false);
      const tid = window.setTimeout(() => setPanelMounted(false), 280);
      return () => window.clearTimeout(tid);
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelReveal(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const openPanel = useCallback(() => {
    setPanelMounted(true);
    setOpen(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const pushBot = useCallback((text: string) => {
    const id = `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [...prev, { id, role: 'bot', text }]);
  }, []);

  const pushUser = useCallback(
    (text: string, opts?: { attachmentUrl?: string | null; attachmentName?: string | null }) => {
      const id = `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: 'user',
          text,
          attachmentUrl: opts?.attachmentUrl ?? null,
          attachmentName: opts?.attachmentName ?? null,
        },
      ]);
    },
    [],
  );

  const revokePendingPreview = useCallback(() => {
    setPendingPick((prev) => {
      if (prev?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }, []);

  const runBotReply = useCallback(
    async (text: string, pace: 'default' | 'support' = 'default') => {
      setTyping(true);
      await new Promise((r) => setTimeout(r, delayForAnswer(text, pace)));
      setTyping(false);
      pushBot(text);
    },
    [pushBot],
  );

  useEffect(() => {
    if (!open || !storeReady) return;
    if (welcomeLock.current) return;
    if (messages.length > 0 || hasWelcomed) {
      welcomeLock.current = true;
      return;
    }
    welcomeLock.current = true;
    void (async () => {
      await runBotReply(t('welcome'), 'default');
      setHasWelcomed(true);
    })();
  }, [open, storeReady, messages.length, hasWelcomed, runBotReply, t]);

  const exitGatheringFields = useCallback(() => {
    setSupportPhase('idle');
    setSupportDraft({});
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    exitGatheringFields();
    setAttachError(null);
    revokePendingPreview();
  }, [exitGatheringFields, revokePendingPreview]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleClose]);

  const buildAttachmentPayloadFromFile = useCallback(
    async (file: File) => {
      if (!isAllowedVisitorImageMime(file.type)) {
        setAttachError(t('support.imageInvalidType'));
        return null;
      }
      if (file.size > SUPPORT_ATTACHMENT_MAX_BYTES) {
        setAttachError(t('support.imageTooLarge'));
        return null;
      }
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (!isLikelySafeImageDataUrl(dataUrl)) {
          setAttachError(t('support.imageInvalidType'));
          return null;
        }
        return {
          attachmentUrl: dataUrl,
          attachmentName: file.name,
          attachmentType: file.type,
        };
      } catch {
        setAttachError(t('support.submitError'));
        return null;
      }
    },
    [t],
  );

  const submitVisitorFollowUp = useCallback(
    async (trimmed: string, pick: { file: File; previewUrl: string } | null) => {
      if (!supportSessionId) return false;
      let attachBody:
        | { attachmentUrl: string; attachmentName: string; attachmentType: string }
        | undefined;

      if (pick?.file) {
        const built = await buildAttachmentPayloadFromFile(pick.file);
        if (!built) return false;
        attachBody = built;
      }

      if (!trimmed && !attachBody) return false;

      setTyping(true);
      setAttachError(null);
      try {
        const res = await fetch('/api/support/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: supportSessionId,
            message: trimmed,
            ...(attachBody ? attachBody : {}),
          }),
        });
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
          message?: ApiMsg;
        } | null;
        setTyping(false);
        if (!res.ok || !data?.ok) {
          const errKey = data?.error;
          if (errKey === 'attachment_too_large') await runBotReply(t('support.imageTooLarge'), 'support');
          else if (errKey === 'attachment_invalid') await runBotReply(t('support.imageInvalidType'), 'support');
          else await runBotReply(t('support.submitError'), 'support');
          return true;
        }
        if (pick?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(pick.previewUrl);
        setPendingPick(null);
        if (data.message) mergeRemoteMessages([data.message]);
        return true;
      } catch {
        setTyping(false);
        await runBotReply(t('support.submitError'), 'support');
        return true;
      }
    },
    [supportSessionId, runBotReply, t, mergeRemoteMessages, buildAttachmentPayloadFromFile],
  );

  const handleSupportPath = useCallback(
    async (trimmed: string, pick: { file: File; previewUrl: string } | null) => {
      if (supportPhase === 'awaiting_name') {
        if (!trimmed) {
          await runBotReply(t('support.emptyName'), 'support');
          return;
        }
        setSupportDraft((d) => ({ ...d, name: trimmed }));
        setSupportPhase('awaiting_email');
        await runBotReply(t('support.askEmail'), 'support');
        return;
      }
      if (supportPhase === 'awaiting_email') {
        if (!isPlausibleEmail(trimmed)) {
          await runBotReply(t('support.invalidEmail'), 'support');
          return;
        }
        setSupportDraft((d) => ({ ...d, email: trimmed.trim() }));
        setSupportPhase('awaiting_whatsapp');
        await runBotReply(t('support.askWhatsapp'), 'support');
        return;
      }
      if (supportPhase === 'awaiting_whatsapp') {
        const wa = isSkipWhatsapp(trimmed) ? null : trimmed.trim();
        setSupportDraft((d) => ({ ...d, whatsapp: wa }));
        setSupportPhase('awaiting_message');
        await runBotReply(t('support.askMessage'), 'support');
        return;
      }
      if (supportPhase === 'awaiting_message') {
        if (!trimmed && !pick) {
          await runBotReply(t('support.emptyMessage'), 'support');
          return;
        }

        let attachBody:
          | { attachmentUrl: string; attachmentName: string; attachmentType: string }
          | undefined;
        if (pick?.file) {
          const built = await buildAttachmentPayloadFromFile(pick.file);
          if (!built) return;
          attachBody = built;
        }

        pushUser(trimmed, {
          attachmentUrl: pick?.previewUrl,
          attachmentName: pick?.file.name ?? null,
        });
        const name = supportDraft.name ?? '';
        const email = supportDraft.email ?? '';
        const whatsapp = supportDraft.whatsapp ?? null;

        setTyping(true);
        setAttachError(null);
        try {
          const res = await fetch('/api/support/conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: supportSessionId ?? undefined,
              fullName: name,
              email,
              whatsapp,
              message: trimmed,
              locale,
              ...(attachBody ? attachBody : {}),
            }),
          });
          const data = (await res.json().catch(() => null)) as {
            ok?: boolean;
            error?: string;
            sessionId?: string;
            messages?: ApiMsg[];
          } | null;

          setTyping(false);

          if (!res.ok || !data?.ok || !data.sessionId) {
            const errKey = data?.error;
            if (errKey === 'attachment_too_large') await runBotReply(t('support.imageTooLarge'), 'support');
            else if (errKey === 'attachment_invalid') await runBotReply(t('support.imageInvalidType'), 'support');
            else await runBotReply(t('support.submitError'), 'support');
            exitGatheringFields();
            return;
          }

          try {
            window.localStorage.setItem(SUPPORT_SESSION_STORAGE_KEY, data.sessionId);
          } catch {
            /* ignore */
          }
          if (pick?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(pick.previewUrl);
          setPendingPick(null);
          setSupportSessionId(data.sessionId);
          setSupportActive(true);
          if (Array.isArray(data.messages)) mergeRemoteMessages(data.messages);
          exitGatheringFields();
          await runBotReply(t('support.requestReceived'), 'support');
        } catch {
          setTyping(false);
          await runBotReply(t('support.submitError'), 'support');
          exitGatheringFields();
        }
      }
    },
    [
      supportPhase,
      supportDraft,
      supportSessionId,
      locale,
      runBotReply,
      t,
      exitGatheringFields,
      mergeRemoteMessages,
      pushUser,
      buildAttachmentPayloadFromFile,
    ],
  );

  const attachmentEligible =
    supportPhase === 'awaiting_message' || (supportActive && supportPhase === 'idle');

  const sendDisabled =
    typing || (attachmentEligible ? !input.trim() && !pendingPick : !input.trim());

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      setAttachError(null);
      if (!isAllowedVisitorImageMime(file.type)) {
        setAttachError(t('support.imageInvalidType'));
        return;
      }
      if (file.size > SUPPORT_ATTACHMENT_MAX_BYTES) {
        setAttachError(t('support.imageTooLarge'));
        return;
      }
      setPendingPick((prev) => {
        if (prev?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(prev.previewUrl);
        return { file, previewUrl: URL.createObjectURL(file) };
      });
    },
    [t],
  );

  const onSubmit = useCallback(async () => {
    const trimmed = input.trim();
    const snapPick = pendingPick;

    if (typing) return;
    if (attachmentEligible) {
      if (!trimmed && !snapPick) return;
    } else if (!trimmed) {
      return;
    }

    setInput('');
    setAttachError(null);

    if (supportActive && supportPhase === 'idle') {
      pushUser(trimmed, {
        attachmentUrl: snapPick?.previewUrl,
        attachmentName: snapPick?.file.name ?? null,
      });
      await submitVisitorFollowUp(trimmed, snapPick);
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    if (supportPhase !== 'idle') {
      if (supportPhase !== 'awaiting_message') {
        pushUser(trimmed);
      }
      await handleSupportPath(trimmed, supportPhase === 'awaiting_message' ? snapPick : null);
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    pushUser(trimmed);

    if (shouldStartSupportFlow(trimmed, locale)) {
      setSupportPhase('awaiting_name');
      await runBotReply(t('support.introPrepare'), 'support');
      await runBotReply(t('support.askName'), 'support');
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    const intent = matchIntent(locale, trimmed) as BotIntent | null;
    if (intent) {
      await runBotReply((t as (key: string) => string)(`answers.${intent}`), 'default');
    } else {
      await runBotReply(t('fallback'), 'default');
    }
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [
    input,
    pendingPick,
    typing,
    supportActive,
    supportPhase,
    pushUser,
    handleSupportPath,
    locale,
    runBotReply,
    t,
    submitVisitorFollowUp,
    attachmentEligible,
  ]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void onSubmit();
    }
  };

  return (
    <>
      <ChatLauncher
        gradientId={launcherGradientId}
        open={open}
        onToggle={() => (open ? handleClose() : openPanel())}
        ariaOpen={t('launcherAriaClose')}
        ariaClosed={t('launcherAriaOpen')}
      />

      {panelMounted ? (
        <ChatPanel
          presentationOpen={open && panelReveal}
          headerGradientId={headerGradientId}
          title={t('title')}
          supportIdentity={supportIdentity}
          onClose={handleClose}
          closeAria={t('closeAria')}
          messagesRef={messagesRef}
          footer={
            <div className="flex flex-col gap-2">
              {attachError ? (
                <p className="text-[11.5px] leading-snug text-[#ffb4a8]" role="alert">
                  {attachError}
                </p>
              ) : null}
              {pendingPick && attachmentEligible ? (
                <div className="flex items-center gap-2 rounded-[0.85rem] border border-[rgba(255,132,17,0.22)] bg-[rgba(7,8,11,0.85)] px-2 py-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingPick.previewUrl}
                    alt=""
                    className="size-11 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-[11.5px] text-[#b8b3a7]">
                    {pendingPick.file.name}
                  </span>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#e8cc65]"
                    onClick={() => {
                      setAttachError(null);
                      revokePendingPreview();
                    }}
                    aria-label={t('support.imageRemoveAria')}
                  >
                    ✕
                  </button>
                </div>
              ) : null}
              <div className="flex items-end gap-2">
                {attachmentEligible ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={onFileInputChange}
                    />
                    <button
                      type="button"
                      className="flex min-h-[2.75rem] min-w-[2.75rem] shrink-0 items-center justify-center rounded-[0.85rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(7,8,11,0.94)] text-[#e8cc65] transition hover:border-[rgba(232,204,101,0.35)] disabled:opacity-[0.4]"
                      disabled={typing}
                      aria-label={t('support.imagePickAria')}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="size-[1.1rem]" strokeWidth={2.25} aria-hidden />
                    </button>
                  </>
                ) : null}
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t('inputPlaceholder')}
                  className="min-h-[3rem] flex-1 resize-none rounded-[0.95rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(7,8,11,0.94)] px-3 py-2.5 text-[13.5px] leading-relaxed text-[#F5F2E9] placeholder:text-[#6f6b63] focus:border-[rgba(232,204,101,0.38)] focus:outline-none focus:ring-[1px] focus:ring-[rgba(255,132,17,0.22)]"
                />
                <button
                  type="button"
                  onClick={() => void onSubmit()}
                  disabled={sendDisabled}
                  className="flex min-h-[2.75rem] min-w-[2.75rem] shrink-0 items-center justify-center rounded-[0.85rem] border border-[rgba(232,204,101,0.42)] transition enabled:hover:-translate-y-px enabled:hover:shadow-[0_10px_28px_rgba(255,132,17,0.22)] disabled:opacity-[0.4]"
                  style={{
                    background:
                      'linear-gradient(148deg, rgba(255,132,17,0.42), rgba(214,167,0,0.26), rgba(232,204,101,0.28))',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.35)',
                  }}
                  aria-label={t('sendAria')}
                >
                  <Send className="size-[1.15rem] text-[#0b0c0e]" strokeWidth={2.35} aria-hidden />
                </button>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-3.5 md:gap-4">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                attachmentUrl={m.attachmentUrl ?? undefined}
                agentAvatarSrc={m.role === 'agent' && assignedAgent ? assignedAgent.imageSrc : null}
              >
                {m.text}
              </ChatMessage>
            ))}
            {typing ? (
              <div
                className="self-start rounded-[1rem] border border-[rgba(255,255,255,0.09)] bg-[rgba(13,13,17,0.96)] px-3 py-2.5 md:rounded-2xl"
                style={{
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.045), 0 6px 20px rgba(0,0,0,0.35)',
                }}
                aria-busy="true"
              >
                <TypingIndicator />
              </div>
            ) : null}
          </div>
        </ChatPanel>
      ) : null}
    </>
  );
}
