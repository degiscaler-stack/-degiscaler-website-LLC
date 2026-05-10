'use client';

/**
 * DegiScaler rule-based chat (client). FAQ answers + live support handoff via /api/support/*.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Send } from 'lucide-react';
import { matchIntent, normalizeUserMessage, shouldStartSupportFlow } from '@/lib/chat/ruleMatcher';
import type { BotIntent } from '@/lib/chat/knowledge';
import ChatLauncher from '@/components/chat/ChatLauncher';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { SUPPORT_SESSION_STORAGE_KEY } from '@/lib/support/public-api';

type ChatBubble = {
  id: string;
  role: 'user' | 'bot' | 'agent';
  text: string;
};

type SupportPhase =
  | 'idle'
  | 'awaiting_name'
  | 'awaiting_email'
  | 'awaiting_whatsapp'
  | 'awaiting_message';

type ApiMsg = { id: string; sender: string; body: string; createdAt?: string };

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

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();
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

  const mapRemoteRow = useCallback(
    (m: ApiMsg): ChatBubble => {
      if (m.sender === 'ADMIN') {
        return { id: m.id, role: 'agent', text: `${t('support.agentPrefix')}${m.body}` };
      }
      if (m.sender === 'VISITOR') {
        return { id: m.id, role: 'user', text: m.body };
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
            const idx = next.findLastIndex(
              (m) => m.role === 'user' && m.text === bubble.text && m.id.startsWith('u-'),
            );
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
      window.localStorage.setItem(storageKey(locale), JSON.stringify({ v: 2, messages, hasWelcomed }));
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

  const pushUser = useCallback((text: string) => {
    const id = `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [...prev, { id, role: 'user', text }]);
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
  }, [exitGatheringFields]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleClose]);

  const submitVisitorFollowUp = useCallback(
    async (trimmed: string) => {
      if (!supportSessionId) return false;
      setTyping(true);
      try {
        const res = await fetch('/api/support/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: supportSessionId, message: trimmed }),
        });
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          message?: ApiMsg;
        } | null;
        setTyping(false);
        if (!res.ok || !data?.ok) {
          await runBotReply(t('support.submitError'), 'support');
          return true;
        }
        if (data.message) mergeRemoteMessages([data.message]);
        return true;
      } catch {
        setTyping(false);
        await runBotReply(t('support.submitError'), 'support');
        return true;
      }
    },
    [supportSessionId, runBotReply, t, mergeRemoteMessages],
  );

  const handleSupportPath = useCallback(
    async (trimmed: string) => {
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
        if (!trimmed) {
          await runBotReply(t('support.emptyMessage'), 'support');
          return;
        }
        pushUser(trimmed);
        const name = supportDraft.name ?? '';
        const email = supportDraft.email ?? '';
        const whatsapp = supportDraft.whatsapp ?? null;

        setTyping(true);
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
            }),
          });
          const data = (await res.json().catch(() => null)) as {
            ok?: boolean;
            sessionId?: string;
            messages?: ApiMsg[];
          } | null;

          setTyping(false);

          if (!res.ok || !data?.ok || !data.sessionId) {
            await runBotReply(t('support.submitError'), 'support');
            exitGatheringFields();
            return;
          }

          try {
            window.localStorage.setItem(SUPPORT_SESSION_STORAGE_KEY, data.sessionId);
          } catch {
            /* ignore */
          }
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
    ],
  );

  const onSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    setInput('');

    if (supportActive && supportPhase === 'idle') {
      pushUser(trimmed);
      await submitVisitorFollowUp(trimmed);
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    if (supportPhase !== 'idle') {
      if (supportPhase !== 'awaiting_message') {
        pushUser(trimmed);
      }
      await handleSupportPath(trimmed);
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
    typing,
    supportActive,
    supportPhase,
    pushUser,
    handleSupportPath,
    locale,
    runBotReply,
    t,
    submitVisitorFollowUp,
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
          onClose={handleClose}
          closeAria={t('closeAria')}
          messagesRef={messagesRef}
          footer={
            <div className="flex items-end gap-2.5">
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
                disabled={typing || !input.trim()}
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
          }
        >
          <div className="flex flex-col gap-3.5 md:gap-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role}>
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
