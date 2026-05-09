'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';

const locales = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'fr', label: 'FR', name: 'Français' },
];

type LanguageSwitcherProps = { className?: string };

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations('nav');
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
    <div ref={ref} className={className ? `relative ${className}` : 'relative'}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="lang-switcher-trigger flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium"
        aria-label={t('languageSwitcher')}
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="lang-switcher-panel absolute top-full end-0 mt-1 rounded-md overflow-hidden z-50 min-w-[120px] shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
          role="listbox"
          aria-label={t('chooseLanguage')}
        >
          {locales.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => handleSelect(loc.code)}
              role="option"
              aria-selected={loc.code === locale}
              className={`lang-switcher-option w-full text-start px-3 py-2 text-sm ${
                loc.code === locale ? 'lang-switcher-option-active' : ''
              }`}
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
