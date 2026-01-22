/**
 * Main Header Component
 * 
 * Floating Glassmorphism navigation header.
 * Refined styles for active states and CTAs using corporate palette.
 */

'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language.provider';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="fixed top-[5%] left-0 right-0 z-50 flex justify-center w-full">
      <nav 
        className="flex items-center justify-between w-[80%] transition-all duration-300"
        style={{
          borderRadius: '1.5rem',
          padding: '0.5rem 1rem 0.5rem', 
          background: 'rgba(10, 10, 20, 0.2)', // Fondo oscuro translúcido para integración con el espacio
          backdropFilter: 'blur(16px)',        // Desenfoque para efecto cristal
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', 
        }}
      >
        {/* Logo */}
        <Link 
          href="/" 
          className="text-white font-bold text-xl tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap mr-6"
        >
          {t.common.brand}
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
          <NavLink href="/" active>
            {t.nav.home}
          </NavLink>
          <NavLink href="/projects">
            {t.nav.projects}
          </NavLink>
        </div>

        {/* Right Side - Contact CTA */}
        <div className="flex items-center gap-4 ml-6">
          <Link
            href="/contact"
            className="px-8 py-3 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-primary-500/30"
            style={{
              borderRadius: '1.5rem',
              padding: '0.5rem 1rem 0.5rem',
              background: 'var(--color-primary-900)', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {t.nav.contact}
          </Link>
        </div>
      </nav>
    </header>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({ 
  href, 
  children, 
  active = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        text-base transition-all duration-300
        ${active 
          ? 'bg-primary-500/20 text-white font-medium shadow-sm' 
          : 'text-white/60 font-light hover:text-white hover:bg-white/5' 
        }
      `}
      style={{
        borderRadius: '1.5rem',
        padding: '0.5rem 1rem',
        border: active ? '0.5px solid rgba(255, 255, 255, 0.1)' : '0.5px solid transparent',
      }}
    >
      {children}
    </Link>
  );
}
