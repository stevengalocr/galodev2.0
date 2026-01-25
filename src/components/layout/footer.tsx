'use client';

/**
 * Footer Component
 *
 * Application footer with links and copyright.
 */

import Link from 'next/link';
import { FaGithub, FaInstagram, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '@/providers/language.provider';

/**
 * Footer Component
 *
 * Clean, minimal footer focused on contact links and brand identity.
 */
export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-black py-12 flex flex-col items-center justify-center relative z-50"
      style={{
        paddingBottom: '1.5rem',
        backgroundColor: '#000000',
      }}
    >
      {/* Simple Row of Contact Icons */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
        <SocialButton
          href="https://github.com/stevengalocr"
          icon={<FaGithub />}
          label="GitHub"
          hoverColor="hover:text-white"
        />
        <SocialButton
          href="https://instagram.com/GaloDevCR"
          icon={<FaInstagram />}
          label="Instagram"
          hoverColor="hover:text-pink-500"
        />
        <SocialButton
          href="https://tiktok.com/@GaloDev"
          icon={<FaTiktok />}
          label="TikTok"
          hoverColor="hover:text-cyan-400"
        />
        <SocialButton
          href="mailto:stevengalocr@gmail.com"
          icon={<FaEnvelope />}
          label="Email"
          hoverColor="hover:text-red-400"
        />
      </div>

      {/* Brand Identity / Copyright */}
      <p
        style={{
          marginTop: '1rem',
          marginBottom: '0.5rem',
        }}
        className="text-slate-400 text-sm font-medium tracking-wide"
      >
        <span className="text-primary-400 font-bold">GaloDev</span>
      </p>
      <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em]">
        © {currentYear} • {t.footer.allRightsReserved}
      </p>
    </footer>
  );
}

/**
 * Social Button Component
 */
function SocialButton({
  href,
  icon,
  label,
  hoverColor,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hoverColor: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-400 text-xl sm:text-2xl transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-110 ${hoverColor}`}
      aria-label={label}
    >
      {/* Tooltip hint */}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        {label}
      </span>
      {icon}
    </Link>
  );
}
