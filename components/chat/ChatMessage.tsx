'use client';

import type { ReactNode } from 'react';

type Role = 'user' | 'bot';

export default function ChatMessage({ role, children }: { role: Role; children: ReactNode }) {
  const user = role === 'user';

  return (
    <div
      className={
        user
          ? 'self-end max-w-[min(92%,20rem)] rounded-2xl rounded-br-md px-[0.9rem] py-2.5 text-[13.75px] leading-[1.6]'
          : 'self-start max-w-[min(94%,21rem)] rounded-2xl rounded-bl-md px-[0.9rem] py-2.5 text-[13.75px] leading-[1.65]'
      }
      style={{
        backgroundColor: user ? 'rgba(20,21,26,0.98)' : 'rgba(17,18,21,0.96)',
        color: '#F5F2E9',
        border: user ? '1px solid rgba(255,132,17,0.35)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: user
          ? '0 12px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(232,204,101,0.12)'
          : '0 10px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div className="whitespace-pre-wrap break-words">{children}</div>
    </div>
  );
}
