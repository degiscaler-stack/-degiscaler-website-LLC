'use client';

import Image from 'next/image';
import type { ReactNode, RefObject } from 'react';
import { Bot, X } from 'lucide-react';

export type ChatSupportIdentity = {
  agentName: string;
  agentImageSrc: string;
  teamLabel: string;
  onlineLabel: string;
  note: string;
};

export default function ChatPanel({
  presentationOpen,
  title,
  onClose,
  closeAria,
  children,
  footer,
  messagesRef,
  headerGradientId,
  supportIdentity,
}: {
  presentationOpen: boolean;
  title: string;
  onClose: () => void;
  closeAria: string;
  children: ReactNode;
  footer: ReactNode;
  messagesRef: RefObject<HTMLDivElement | null>;
  headerGradientId: string;
  supportIdentity?: ChatSupportIdentity | null;
}) {
  const sid = supportIdentity;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label={title}
      className={`chat-panel-motion fixed bottom-[4.75rem] right-3 z-[156] flex w-[calc(100vw-1.5rem)] max-w-[min(100vw-1.5rem,420px)] flex-col overflow-hidden rounded-[1.15rem] md:bottom-[5.25rem] md:right-5 md:max-h-[640px] md:w-[min(100vw-2rem,408px)] ${
        presentationOpen ? 'chat-panel-motion--open' : 'chat-panel-motion--closed'
      }`}
      style={{
        maxHeight: 'min(640px, calc(100dvh - 5.75rem))',
        border: '1px solid rgba(255,255,255,0.11)',
        background:
          'linear-gradient(152deg, rgba(255,132,17,0.055) 0%, transparent 48%), linear-gradient(180deg, #0e0f12 0%, #0a0a0e 52%, #060608 100%)',
        boxShadow:
          '0 0 0 1px rgba(255,132,17,0.07) inset, 0 24px 56px rgba(0,0,0,0.72), 0 0 90px rgba(255,132,17,0.055)',
      }}
    >
      <svg width={1} height={1} className="pointer-events-none absolute overflow-hidden opacity-0" aria-hidden focusable={false}>
        <defs>
          <linearGradient id={headerGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="12%" stopColor="#ff8411" />
            <stop offset="50%" stopColor="#d6a700" />
            <stop offset="88%" stopColor="#e8cc65" />
          </linearGradient>
        </defs>
      </svg>

      <header className="flex shrink-0 items-center gap-3 border-b border-[rgba(255,255,255,0.07)] px-3.5 py-3 md:px-4 md:py-3.5">
        <div
          className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[0.65rem] md:size-10 md:rounded-xl"
          style={{
            border: '1px solid rgba(232,204,101,0.32)',
            background: sid
              ? undefined
              : 'linear-gradient(140deg, rgba(255,132,17,0.18), rgba(9,9,12,0.96))',
            boxShadow: '0 0 18px rgba(255,132,17,0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {sid ? (
            <Image
              src={sid.agentImageSrc}
              alt=""
              width={40}
              height={40}
              className="size-full object-cover"
            />
          ) : (
            <Bot className="h-[1.15rem] w-[1.15rem] md:h-5 md:w-5" stroke={`url(#${headerGradientId})`} strokeWidth={2} fill="none" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[14.5px] font-bold tracking-tight text-[#F5F2E9] md:text-[15px]">
            {sid ? sid.agentName : title}
          </h2>
          {sid ? (
            <div className="mt-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#b8b3a7]">
                  {sid.teamLabel}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide"
                  style={{
                    border: '1px solid rgba(76,217,100,0.38)',
                    background: 'rgba(76,217,100,0.1)',
                    color: '#b9f3c5',
                  }}
                >
                  {sid.onlineLabel}
                </span>
              </div>
              <p className="text-[11.5px] leading-snug text-[#8f8a80]">{sid.note}</p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#b8b3a7] transition hover:border-[rgba(232,204,101,0.35)] hover:bg-[rgba(255,132,17,0.07)] hover:text-[#f5f2e9] hover:shadow-[0_0_16px_rgba(255,132,17,0.12)]"
          aria-label={closeAria}
          onClick={onClose}
        >
          <X className="size-[1.15rem]" strokeWidth={2.25} />
        </button>
      </header>

      <div
        ref={messagesRef}
        className="min-h-[10.5rem] flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-3.5 md:min-h-[11.5rem] md:px-4 md:py-4 [scrollbar-width:thin] [scrollbar-color:rgba(232,204,101,0.28)_transparent]"
      >
        {children}
      </div>

      <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,8,0.35)] px-3 py-2.5 md:px-3.5 md:py-3">{footer}</div>
    </section>
  );
}
