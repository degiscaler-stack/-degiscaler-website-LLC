'use client';

/**
 * DegiScaler rule-based chat (client-only). Future integration points:
 * TODO: persist support requests to database when backend is ready
 * TODO: connect prepared requests to internal support dashboard
 * TODO: allow human agent replies inside the same thread (real-time/channel)
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Send } from 'lucide-react';
import { matchIntent, shouldStartSupportFlow } from '@/lib/chat/ruleMatcher';
import type { BotIntent } from '@/lib/chat/knowledge';
import ChatLauncher from '@/components/chat/ChatLauncher';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatMessage from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';

type ChatBubble = {
  id: string;
  role: 'user' | 'bot';
  text: string;
};

type SupportPhase = 'idle' | 'awaiting_name' | 'awaiting_email' | 'awaiting_message';

/** High-level UX mode for future dashboard wiring — not persisted to DB yet. */
type AssistStatus = 'bot' | 'collecting_support_details' | 'support_request_prepared';

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
          (m) => m && (m.role === 'user' || m.role === 'bot') && typeof m.text === 'string'
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

function fillTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

function isPlausibleEmail(s: string) {
  const t = s.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function linkifyMailto(text: string): ReactNode {
  const parts = text.split(/(mailto:[^\s\r\n<]+)/gi);
  return parts.map((part, i) =>
    part.toLowerCase().startsWith('mailto:') ? (
      <a
        key={`mailto-${i}`}
        href={part}
        className="break-all font-semibold text-[#e8cc65] underline underline-offset-[3px] decoration-[rgba(232,204,101,0.45)] hover:text-[#f5ebb4]"
      >
        {part}
      </a>
    ) : (
      <span key={`txt-${i}`}>{part}</span>
    )
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
  /** Drives CSS enter animation on first paint after mount (no extra deps). */
  const [panelReveal, setPanelReveal] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [supportPhase, setSupportPhase] = useState<SupportPhase>('idle');
  const [supportDraft, setSupportDraft] = useState<{ name?: string; email?: string }>({});
  const [assistStatus, setAssistStatus] = useState<AssistStatus>('bot');

  const persist = useCallback(() => {
    if (typeof window === 'undefined' || !storeReady) return;
    try {
      window.localStorage.setItem(storageKey(locale), JSON.stringify({ v: 1, messages, hasWelcomed }));
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
  }, [locale]);

  useEffect(() => {
    if (!storeReady) return;
    const tmr = window.setTimeout(persist, 320);
    return () => window.clearTimeout(tmr);
  }, [messages, hasWelcomed, persist, storeReady]);

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
    [pushBot]
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
    setAssistStatus('bot');
  }, [exitGatheringFields]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleClose]);

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
        setSupportPhase('awaiting_message');
        await runBotReply(t('support.askMessage'), 'support');
        return;
      }
      if (supportPhase === 'awaiting_message') {
        if (!trimmed) {
          await runBotReply(t('support.emptyMessage'), 'support');
          return;
        }
        const name = supportDraft.name ?? '';
        const email = supportDraft.email ?? '';
        const subject = fillTemplate(t('support.mailSubject'), { name, email });
        const body = fillTemplate(t('support.mailBody'), { name, email, message: trimmed });
        const mailto = `mailto:support@degiscaler.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const combined = `${t('support.confirmation')}\n\n${t('support.copyBlock', { name, email, message: trimmed })}\n\n${t('support.mailtoLine', { mailto })}`;
        await runBotReply(combined, 'support');
        exitGatheringFields();
        setAssistStatus('support_request_prepared');
      }
    },
    [supportPhase, supportDraft, runBotReply, t, exitGatheringFields]
  );

  const onSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    setInput('');

    if (assistStatus === 'support_request_prepared') {
      setAssistStatus('bot');
    }

    pushUser(trimmed);

    if (supportPhase !== 'idle') {
      await handleSupportPath(trimmed);
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    if (shouldStartSupportFlow(trimmed, locale)) {
      setSupportPhase('awaiting_name');
      setAssistStatus('collecting_support_details');
      await runBotReply(t('support.introPrepare'), 'support');
      await runBotReply(t('support.askName'), 'support');
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    const intent = matchIntent(locale, trimmed) as BotIntent | null;
    if (intent) {
      await runBotReply((t as (key: string) => string)(`answers.${intent}`), 'default');
    } else {
      await runBotReply(t('fallback'), 'support');
    }
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [
    input,
    typing,
    assistStatus,
    pushUser,
    supportPhase,
    handleSupportPath,
    locale,
    runBotReply,
    t,
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
                {m.role === 'bot' ? linkifyMailto(m.text) : m.text}
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
