'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';

const locales = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'fr', label: 'FR', name: 'Français' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(code: string) {
    setOpen(false);
    router.push(pathname, { locale: code });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors"
        style={{ color: '#a1a1aa', border: '1px solid #2a2a2a' }}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 rounded-md overflow-hidden z-50 min-w-[120px]"
          style={{
            backgroundColor: '#111111',
            border: '1px solid #2a2a2a',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            right: 0,
          }}
        >
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              className="w-full text-start px-3 py-2 text-sm transition-colors"
              style={{
                color: loc.code === locale ? '#FF8411' : '#a1a1aa',
                backgroundColor:
                  loc.code === locale ? 'rgba(255,132,17,0.08)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (loc.code !== locale)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                if (loc.code !== locale)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'transparent';
              }}
            >
              <span className="font-medium">{loc.label}</span>
              <span className="ms-2 text-xs opacity-60">{loc.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
