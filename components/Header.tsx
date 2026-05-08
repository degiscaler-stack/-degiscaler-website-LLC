'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navKeys = ['services', 'pricing', 'about', 'contact', 'faq'] as const;

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRtl = locale === 'ar';

  const navLinks = navKeys.map((key) => ({
    href: `/${key}` as const,
    label: t(key),
  }));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1f1f1f',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="DegiScaler LLC — Home"
          >
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: '#FF8411' }}
            >
              Degi
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              Scaler
            </span>
            <span
              className="text-xs font-medium hidden sm:inline"
              style={{ color: '#71717a' }}
            >
              LLC
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? '#FF8411' : '#a1a1aa',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = '#a1a1aa';
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right: language + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              style={{
                backgroundColor: '#FF8411',
                color: '#ffffff',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  '#e87510')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  '#FF8411')
              }
            >
              {t('getStarted')}
            </Link>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md"
              style={{ color: '#a1a1aa' }}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: '#0f0f0f',
            borderTop: '1px solid #1f1f1f',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 rounded-md text-sm font-medium"
                style={{ color: '#a1a1aa' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-1" style={{ borderColor: '#1f1f1f' }}>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: '#FF8411', color: '#ffffff' }}
                onClick={() => setMenuOpen(false)}
              >
                {t('getStarted')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
