'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Download, PenSquare, LogOut, ArrowRight,
  Sparkles, CheckCircle2,
} from 'lucide-react';
import { SiTiktok, SiInstagram } from 'react-icons/si';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    href: '/herramientas/descargar',
    icon: Download,
    label: 'Descargador de Videos',
    tagline: 'TikTok sin marca de agua · Instagram Reels en HD',
    description:
      'Descargá cualquier TikTok o Reel de Instagram en alta calidad, sin marcas de agua y al instante. Sin límites, sin registro.',
    acento: '#3B82F6',
    acentoGlow: 'rgba(59,111,217,0.14)',
    acentoGlowStrong: 'rgba(59,111,217,0.28)',
    acentoBorder: 'rgba(80,137,255,0.28)',
    acentoBorderHover: 'rgba(80,137,255,0.55)',
    acentoText: '#7baeff',
    shimmer: 'from-transparent via-blue-500/50 to-transparent',
    features: [
      { icon: SiTiktok, label: 'TikTok sin marca de agua' },
      { icon: SiInstagram, label: 'Instagram Reels HD' },
      { icon: Download, label: 'MP4 o MP3' },
    ],
  },
  {
    href: '/herramientas/crear-post',
    icon: PenSquare,
    label: 'Crear Post IA',
    tagline: 'Copy + diseño listo para publicar en minutos',
    description:
      'De la idea al carrusel completo — Claude genera el texto, Google Imagen crea los fondos y Satori construye cada slide con identidad GaloDev.',
    acento: '#8B5CF6',
    acentoGlow: 'rgba(139,92,246,0.12)',
    acentoGlowStrong: 'rgba(139,92,246,0.26)',
    acentoBorder: 'rgba(139,92,246,0.28)',
    acentoBorderHover: 'rgba(139,92,246,0.55)',
    acentoText: '#c4b5fd',
    shimmer: 'from-transparent via-violet-500/50 to-transparent',
    features: [
      { icon: SiInstagram, label: 'Carruseles de Instagram' },
      { icon: PenSquare, label: 'Copy con Claude IA' },
      { icon: Sparkles, label: 'Imágenes con Google Imagen' },
    ],
  },
] as const;

// ── Main component ────────────────────────────────────────────────────────────

export default function HerramientasHub() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/herramientas/login');
    router.refresh();
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
    >
      {/* ── Background ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/galodev_tools_bg.png"
          alt="Space Background"
          fill
          className="object-cover opacity-70 mix-blend-screen"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[#020412]/80 backdrop-blur-[2px]" />
      </div>

      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 900, height: 600,
            top: '-10%', left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(59,111,217,0.1) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '0%', right: '-5%',
            background: 'radial-gradient(circle, rgba(124,59,217,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between"
        style={{
          padding: '0 24px',
          height: '64px',
          background: 'rgba(2,4,18,0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">
            GaloDev
          </span>
        </Link>

        {/* Center: status pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            padding: '0.25rem 0.75rem',
            background: 'rgba(52,211,153,0.07)',
            border: '1px solid rgba(52,211,153,0.15)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-emerald-400/70">
            2 herramientas activas
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[12.5px] text-white/30 hover:text-white/65 transition-all duration-200 group px-3 py-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid transparent')}
        >
          <LogOut size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          <span className="hidden sm:block">Cerrar sesión</span>
        </button>
      </header>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <main style={{ padding:'3rem', marginTop: '2rem' }} className="relative z-10 flex flex-col items-center pt-[108px] pb-24 px-5">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="w-full max-w-[680px] text-center mb-10"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
              style={{
                background: 'rgba(59,111,217,0.1)',
                border: '1px solid rgba(80,137,255,0.22)',
              }}
            >
              <Sparkles size={10} style={{ color: '#7baeff' }} />
              <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase" style={{ color: '#7baeff' }}>
                Panel privado
              </span>
            </div>
          </div>

          <h1 className="text-[34px] sm:text-[42px] font-bold text-white leading-[1.08] tracking-tight mb-3">
            Tus herramientas
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/38 font-light leading-relaxed">
            Todo lo que necesitás para producir contenido de calidad.
          </p>
        </motion.div>

        {/* Tools */}
        <div className="w-full max-w-[680px] flex flex-col gap-4">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                <Link href={tool.href} className="block group">
                  <div
                    className="relative rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: 'rgba(5,7,20,0.96)',
                      border: `1px solid ${tool.acentoBorder}`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.45)`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(-3px)';
                      el.style.border = `1px solid ${tool.acentoBorderHover}`;
                      el.style.boxShadow = `0 20px 60px ${tool.acentoGlowStrong}, 0 8px 24px rgba(0,0,0,0.5)`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(0)';
                      el.style.border = `1px solid ${tool.acentoBorder}`;
                      el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.45)`;
                    }}
                  >
                    {/* Top shimmer */}
                    <div
                      className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${tool.shimmer}`}
                    />

                    {/* Glow blob top-right */}
                    <div
                      className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${tool.acentoGlowStrong} 0%, transparent 70%)`,
                        filter: 'blur(28px)',
                      }}
                    />

                    <div className="relative p-7 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                        {/* Left: icon + content */}
                        <div style={{ padding: '1rem' }} className="flex-1 flex flex-col gap-4">
                          {/* Icon + badge */}
                          <div className="flex items-center justify-between">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: tool.acentoGlow,
                                border: `1px solid ${tool.acentoBorder}`,
                              }}
                            >
                              <Icon size={22} style={{ color: tool.acento }} />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
                              <span
                                className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                                style={{
                                  padding: '0.25rem 0.625rem',
                                  background: 'rgba(52,211,153,0.1)',
                                  border: '1px solid rgba(52,211,153,0.22)',
                                  color: '#34d399',
                                }}
                              >
                                Disponible
                              </span>
                            </div>
                          </div>

                          {/* Text */}
                          <div>
                            <h2 className="text-[18px] sm:text-[20px] font-bold text-white leading-tight mb-1.5">
                              {tool.label}
                            </h2>
                            <p className="text-[13px] text-white/32 mb-3" style={{ color: tool.acentoText, opacity: 0.7 }}>
                              {tool.tagline}
                            </p>
                            <p className="text-[13.5px] text-white/40 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>

                          {/* Features + CTA */}
                          <div className="flex items-center justify-between mt-1">
                            {/* Feature chips */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {tool.features.map(({ icon: FeatureIcon, label: featureLabel }) => (
                                <span
                                  key={featureLabel}
                                  className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
                                  style={{
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: 'rgba(255,255,255,0.35)',
                                  }}
                                >
                                  <FeatureIcon size={9} />
                                  {featureLabel}
                                </span>
                              ))}
                            </div>

                            {/* Arrow CTA */}
                            <div
                              className="hidden sm:flex items-center gap-1 text-[13px] font-semibold flex-shrink-0 ml-4 group-hover:gap-2 transition-all duration-200"
                              style={{ color: tool.acentoText }}
                            >
                              <span>Abrir</span>
                              <ArrowRight
                                size={14}
                                className="group-hover:translate-x-1 transition-transform duration-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile CTA */}
                      <div
                        className="sm:hidden mt-5 pt-4 flex items-center justify-end"
                        style={{paddingRight: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <span
                          className="flex items-center gap-1.5 text-[13px] font-semibold"
                          style={{ color: tool.acentoText }}
                        >
                          Abrir herramienta
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          style={{ marginTop: '1rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 text-[11px] text-white/15 tracking-wider"
        >
          Acceso privado · GaloDev
        </motion.p>
      </main>
    </div>
  );
}
