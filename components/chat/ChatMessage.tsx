'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

type Role = 'user' | 'bot' | 'agent';

export default function ChatMessage({
  role,
  children,
  attachmentUrl,
  agentAvatarSrc,
}: {
  role: Role;
  children: ReactNode;
  attachmentUrl?: string | null;
  agentAvatarSrc?: string | null;
}) {
  const user = role === 'user';
  const agent = role === 'agent';

  const bubbleInner = (
    <>
      {attachmentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- visitor uploads / blob previews / data URLs
        <img
          src={attachmentUrl}
          alt=""
          className="mb-2 max-h-44 w-auto max-w-full rounded-xl border border-[rgba(255,255,255,0.08)] object-contain"
        />
      ) : null}
      <div className="whitespace-pre-wrap break-words">{children}</div>
    </>
  );

  const bubble = (
    <div
      className={
        user
          ? 'max-w-[min(92%,20rem)] rounded-2xl rounded-br-md px-[0.9rem] py-2.5 text-[13.75px] leading-[1.6]'
          : 'max-w-[min(94%,21rem)] rounded-2xl rounded-bl-md px-[0.9rem] py-2.5 text-[13.75px] leading-[1.65]'
      }
      style={{
        backgroundColor: user ? 'rgba(20,21,26,0.98)' : 'rgba(17,18,21,0.96)',
        color: '#F5F2E9',
        border: user
          ? '1px solid rgba(255,132,17,0.35)'
          : agent
            ? '1px solid rgba(232,204,101,0.38)'
            : '1px solid rgba(255,255,255,0.1)',
        boxShadow: user
          ? '0 12px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(232,204,101,0.12)'
          : '0 10px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {bubbleInner}
    </div>
  );

  if (agent && agentAvatarSrc) {
    return (
      <div className="flex max-w-[min(96%,22rem)] items-end gap-2 self-start">
        <Image
          src={agentAvatarSrc}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full object-cover ring-1 ring-[rgba(232,204,101,0.35)]"
        />
        {bubble}
      </div>
    );
  }

  return (
    <div className={user ? 'self-end' : 'self-start'}>
      {bubble}
    </div>
  );
}
