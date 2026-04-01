'use client';

/**
 * Tools Hub Page
 *
 * Private admin-gated portal that houses all GaloDev tools.
 * Password: 2002 (hardcoded for simplicity, private section)
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const ADMIN_CODE = '2002';
const SESSION_KEY = 'galodev-tools-auth';

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setCode('');
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(59,111,217,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Floating orbs */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 animate-float"
          style={{
            background: 'var(--color-primary-500)',
            top: '20%',
            left: '10%',
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full blur-3xl opacity-15 animate-float"
          style={{
            background: 'var(--color-secondary-500)',
            top: '60%',
            right: '15%',
            animationDelay: '3s',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              marginBottom: '20px',
              background: 'rgba(10,10,20,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(59,111,217,0.3)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#lockGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="lockGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary-400)" />
                  <stop offset="100%" stopColor="var(--color-secondary-400)" />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div
          className={`rounded-3xl p-8 transition-all duration-300 ${shaking ? 'tools-shake' : ''}`}
          style={{
            background: 'rgba(10,10,20,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: error
              ? '0 0 40px rgba(239,68,68,0.2), 0 20px 60px rgba(0,0,0,0.4)'
              : '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div className="text-center mb-8">
            <div
              style={{ padding: '15px' }}
              className="text-xs font-semibold tracking-[0.3em] uppercase text-primary-400 mb-3"
            >
              GaloDev
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Zona Privada</h1>
            <p className="text-sm text-slate-400">
              Esta sección es exclusiva. Ingresa el código de acceso para continuar.
            </p>
          </div>

          <form style={{ padding: '15px' }} onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de acceso"
                className="w-full px-5 py-4 rounded-2xl text-white placeholder-slate-500 text-center text-lg tracking-widest outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: error
                    ? '1px solid rgba(239,68,68,0.6)'
                    : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: error ? '0 0 20px rgba(239,68,68,0.15)' : 'none',
                }}
                autoComplete="off"
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm"
                style={{
                  marginTop: '10px',
                  padding: '15px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Código incorrecto. Acceso denegado.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                marginTop: '20px',
                background:
                  'linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-600))',
                boxShadow: '0 8px 24px rgba(59,111,217,0.3)',
              }}
            >
              Acceder →
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Solo para uso administrativo de GaloDev
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-10px);
          }
          40% {
            transform: translateX(10px);
          }
          60% {
            transform: translateX(-8px);
          }
          80% {
            transform: translateX(8px);
          }
        }
        .tools-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// ─── Tool Card ───────────────────────────────────────────────────────────────

function ToolCard({
  href,
  icon,
  title,
  description,
  badge,
  gradient,
  accentColor,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  gradient: string;
  accentColor: string;
}) {
  return (
    <Link
      href={href}
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'rgba(12,12,24,0.8)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}30`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
      }}
    >
      {/* Top gradient bar */}
      <div style={{ height: '3px', width: '100%', background: gradient, flexShrink: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px' }}>
        {/* Top row: badge + icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '5px 12px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </span>

          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: gradient,
              boxShadow: `0 6px 20px ${accentColor}50`,
              transition: 'transform 0.25s ease',
            }}
          >
            {icon}
          </div>
        </div>

        {/* Title + description */}
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            flex: 1,
          }}
        >
          {description}
        </p>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: accentColor,
          }}
        >
          Abrir herramienta
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ transition: 'transform 0.2s ease' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Hub ─────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved === '1') setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* ── Fade to black at bottom (matches footer) ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '220px', pointerEvents: 'none', zIndex: 5,
        background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
      }} />

      {/* ── Rich ambient background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Top radial sweep */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(59,111,217,0.30) 0%, transparent 70%)',
        }} />
        {/* Instagram orb — left */}
        <div style={{
          position: 'absolute', width: '520px', height: '520px', borderRadius: '50%',
          filter: 'blur(110px)', opacity: 0.22,
          top: '5%', left: '-8%',
          background: 'radial-gradient(circle, #e1306c 0%, #833ab4 100%)',
        }} />
        {/* TikTok orb — right */}
        <div style={{
          position: 'absolute', width: '480px', height: '480px', borderRadius: '50%',
          filter: 'blur(110px)', opacity: 0.18,
          top: '10%', right: '-6%',
          background: 'radial-gradient(circle, #69C9D0 0%, #EE1D52 100%)',
        }} />
        {/* Subtle bottom fill */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 35% at 50% 105%, rgba(80,137,255,0.12) 0%, transparent 70%)',
        }} />
      </div>

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '860px',
          margin: '0 auto',
          padding: 'calc(5vh + 96px) 24px 80px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── Hero Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '52px', width: '100%' }}>
          {/* Tag pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                padding: '7px 16px',
                borderRadius: '9999px',
                background: 'rgba(59,111,217,0.15)',
                border: '1px solid rgba(80,137,255,0.45)',
                color: '#5089ff',
              }}
            >
              <svg
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              Centro de Herramientas
              <svg
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Herramientas{' '}
            <span style={{
              background: 'linear-gradient(135deg, #5089ff, #9a50ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>GaloDev</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: '#94a3b8',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            Descarga y gestiona contenido digital. Rápido, privado y con la magia de GaloDev.
          </p>
        </div>

        {/* ── Tools Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            width: '100%',
            maxWidth: '700px',
          }}
        >
          <ToolCard
            href="/tools/instagram"
            badge="Descargador · Gratis"
            title="Instagram Downloader"
            description="Descarga Reels, fotos, carruseles e IGTV en alta calidad. Sin inicio de sesión. Sin datos personales."
            gradient="linear-gradient(135deg, #e1306c, #fd1d1d, #833ab4)"
            accentColor="#e1306c"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            }
          />

          <ToolCard
            href="/tools/tiktok"
            badge="Descargador · Gratis"
            title="TikTok Downloader"
            description="Descarga videos de TikTok sin marca de agua en la mejor calidad. Rápido y sin complicaciones."
            gradient="linear-gradient(135deg, #010101, #69C9D0, #EE1D52)"
            accentColor="#69C9D0"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.27 8.27 0 0 0 4.83 1.55V6.87a4.85 4.85 0 0 1-1.06-.18z" />
              </svg>
            }
          />
        </div>

        {/* ── Footer Note ── */}
        <p
          style={{
            textAlign: 'center',
            color: '#334155',
            fontSize: '11px',
            marginTop: '56px',
            letterSpacing: '0.06em',
          }}
        >
          Herramientas privadas · GaloDev © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
