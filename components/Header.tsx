'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import BrandLogo from './BrandLogo';
import { primaryBtnClass, accentEyebrowClass } from '@/components/home/homeTheme';

const navKeys = ['services', 'pricing', 'about', 'contact', 'faq'] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = navKeys.map((key) => ({
    href: `/${key}` as const,
    label: t(key),
  }));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'rgba(5, 5, 5, 0.96)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 1px 0 rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,132,17,0.04), inset 0 1px 0 rgba(232,204,101,0.03)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between min-h-[4.25rem] py-3 md:py-3.5">
          <BrandLogo />

          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link-muted px-3 lg:px-4 py-2.5 rounded-lg text-[14px] lg:text-[15px] font-medium transition-colors ${
                    isActive ? `${accentEyebrowClass} underline decoration-[rgba(232,204,101,0.35)] underline-offset-8` : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/contact" className={`${primaryBtnClass} px-5 lg:px-6 py-2.5 rounded-lg text-[14px]`}>
              {t('getStarted')}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-lg text-[#B8B3A7] hover:text-[#e8cc65] hover:bg-white/[0.04]"
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[#070707]">
          <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link-muted px-3 py-3 rounded-lg text-[15px] font-medium hover:bg-white/[0.04] ${isActive ? `${accentEyebrowClass} bg-white/[0.02]` : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[rgba(255,255,255,0.08)]">
              <Link
                href="/contact"
                className={`${primaryBtnClass} block w-full text-center px-4 py-3.5 rounded-lg text-[14px]`}
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
