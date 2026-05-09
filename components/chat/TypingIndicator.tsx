'use client';

/** Three subtle gradient dots — no text; conveys “thinking”. */
export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="chat-typing-dot h-2 w-2 shrink-0 rounded-full"
          style={{
            animationDelay: `${i * 160}ms`,
            background: 'linear-gradient(135deg, #ff8411 0%, #d6a700 52%, #e8cc65 100%)',
            boxShadow: '0 0 10px rgba(255,132,17,0.45), 0 0 16px rgba(232,204,101,0.2)',
          }}
        />
      ))}
    </div>
  );
}
