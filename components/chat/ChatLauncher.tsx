'use client';

import { Headphones, MessageSquareText, X } from 'lucide-react';

export default function ChatLauncher({
  open,
  onToggle,
  ariaOpen,
  ariaClosed,
  gradientId,
}: {
  open: boolean;
  onToggle: () => void;
  ariaOpen: string;
  ariaClosed: string;
  gradientId: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group fixed bottom-5 right-4 z-[162] md:bottom-[1.375rem] md:right-6 flex md:h-[3.25rem] md:w-[3.25rem] h-11 w-11 items-center justify-center rounded-[0.95rem] md:rounded-[1.15rem] transition-[transform,box-shadow] duration-200 ease-out ${
        open ? 'scale-[0.97] shadow-[0_8px_28px_rgba(0,0,0,0.55)]' : 'hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(255,132,17,0.22),0_8px_28px_rgba(0,0,0,0.55)]'
      }`}
      style={{
        border: '1px solid rgba(232,204,101,0.42)',
        background:
          'linear-gradient(165deg, rgba(15,15,18,0.99) 0%, rgba(5,5,8,1) 55%, rgba(10,9,12,1) 100%)',
        boxShadow:
          '0 0 0 1px rgba(255,132,17,0.14) inset, 0 3px 16px rgba(255,132,17,0.18), 0 12px 36px rgba(0,0,0,0.62)',
      }}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={open ? ariaOpen : ariaClosed}
    >
      <svg width={1} height={1} className="pointer-events-none absolute overflow-hidden opacity-0" aria-hidden focusable={false}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="10%" stopColor="#ff8411" />
            <stop offset="48%" stopColor="#d6a700" />
            <stop offset="92%" stopColor="#e8cc65" />
          </linearGradient>
        </defs>
      </svg>

      {!open && (
        <>
          <span
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-30 blur-[18px]"
            style={{
              background: 'radial-gradient(ellipse 75% 70% at 42% 32%, #ff8411 0%, #d6a700 45%, transparent 72%)',
            }}
          />
          <span
            className="pointer-events-none absolute inset-px rounded-[calc(0.95rem-1px)] md:rounded-[calc(1.15rem-1px)] ring-1 ring-[rgba(255,132,17,0.12)]"
            aria-hidden
          />
        </>
      )}

      {!open ? (
        <span className="relative flex h-[22px] w-[22px] md:h-[26px] md:w-[26px] items-center justify-center" aria-hidden>
          <Headphones
            className="absolute left-0 top-0 h-[19px] w-[19px] md:h-[22px] md:w-[22px]"
            stroke={`url(#${gradientId})`}
            strokeWidth={2.15}
            fill="none"
          />
          <MessageSquareText
            className="absolute -bottom-px -right-px h-[11px] w-[11px] md:h-[13px] md:w-[13px] drop-shadow-[0_0_6px_rgba(255,132,17,0.45)]"
            stroke={`url(#${gradientId})`}
            strokeWidth={2.4}
            fill="rgba(255,132,17,0.08)"
          />
        </span>
      ) : (
        <X className="relative h-[1.22rem] w-[1.22rem] md:h-[1.32rem] md:w-[1.32rem] shrink-0" style={{ color: '#e8cc65' }} strokeWidth={2.35} aria-hidden />
      )}
    </button>
  );
}
