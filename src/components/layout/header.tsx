/**
 * Main Header Component
 *
 * Floating Glassmorphism navigation header with fullscreen mobile menu and language switcher.
 * Refined styles for active states and CTAs using corporate palette.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/providers/language.provider';

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <>
      <header className="fixed top-[5%] left-0 right-0 z-50 flex justify-center w-full px-4">
        <nav
          className="flex items-center justify-between w-full max-w-6xl transition-all duration-300"
          style={{
            borderRadius: '1.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(10, 10, 20, 0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-bold text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap z-50"
          >
            {t.common.brand}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-1 justify-center">
            <NavLink href="/" active>
              {t.nav.home}
            </NavLink>
            {/* <NavLink href="/projects">{t.nav.projects}</NavLink> */}
            <NavLink href="/#entrepreneurs">{t.nav.entrepreneurs}</NavLink>
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>

          {/* Right Side - Language Switcher + Contact CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="group relative p-1.5 hover:bg-white/10 rounded-full transition-all duration-300"
              aria-label="Change language"
              title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <div className="w-8 h-8 relative transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={locale === 'es' ? '/images/costa-rica-flag.png' : '/images/usa-flag.png'}
                  alt={locale === 'es' ? 'Costa Rica' : 'USA'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              </div>
            </button>

            {/* Contact CTA */}
            <Link
              href="/contacto"
              className="text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-primary-500/30 whitespace-nowrap"
              style={{
                borderRadius: '1.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--color-primary-900)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {t.nav.contact}
            </Link>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(10, 10, 20, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-8 right-8 p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu Content - Centered */}
        <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
          <MobileNavLink href="/" active onClick={() => setMobileMenuOpen(false)}>
            {t.nav.home}
          </MobileNavLink>

          {/* <MobileNavLink href="/projects" onClick={() => setMobileMenuOpen(false)}>
            {t.nav.projects}
          </MobileNavLink> */}

          <MobileNavLink href="/#entrepreneurs" onClick={() => setMobileMenuOpen(false)}>
            {t.nav.entrepreneurs}
          </MobileNavLink>

          <MobileNavLink href="/contacto" onClick={() => setMobileMenuOpen(false)}>
            {t.nav.contact}
          </MobileNavLink>

          {/* Language Switcher - Mobile */}
          <button
            onClick={toggleLanguage}
            className="w-full max-w-sm text-center text-xl font-light transition-all duration-300 text-white/70 hover:text-white flex items-center justify-center gap-4"
            style={{
              paddingTop: '1rem',
              paddingBottom: '1rem',
              borderRadius: '1.5rem',
              background: 'rgba(255, 255, 255, 0.015)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src={locale === 'es' ? '/images/costa-rica-flag.png' : '/images/usa-flag.png'}
                alt={locale === 'es' ? 'Costa Rica' : 'USA'}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="leading-none pt-1">{locale === 'es' ? 'Español' : 'English'}</span>
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Desktop Navigation Link Component
 */
function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        text-sm lg:text-base transition-all duration-300 whitespace-nowrap
        ${
          active
            ? 'bg-primary-500/20 text-white font-medium shadow-sm'
            : 'text-white/60 font-light hover:text-white hover:bg-white/5'
        }
      `}
      style={{
        borderRadius: '1.5rem',
        padding: '0.5rem 0.75rem',
        border: active ? '0.5px solid rgba(255, 255, 255, 0.1)' : '0.5px solid transparent',
      }}
    >
      {children}
    </Link>
  );
}

/**
 * Mobile Navigation Link Component - Fullscreen Menu Style
 */
function MobileNavLink({
  href,
  children,
  active = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        w-full max-w-sm text-center text-xl font-light transition-all duration-300
        ${active ? 'text-white font-medium' : 'text-white/70 hover:text-white'}
      `}
      style={{
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        borderRadius: '1.5rem',
        background: active ? 'rgba(59, 111, 217, 0.12)' : 'rgba(255, 255, 255, 0.015)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: active
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.03)',
        boxShadow: active
          ? '0 4px 20px rgba(59, 111, 217, 0.15)'
          : '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      {children}
    </Link>
  );
}
