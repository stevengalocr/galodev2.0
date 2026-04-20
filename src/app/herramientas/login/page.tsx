'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export default function HerramientasLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      setLoading(false);
      return;
    }

    router.push('/herramientas');
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-5">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      {/* Glow blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: '50%',
            left: '50%',
            transform: 'translate(-70%, -60%)',
            background: 'radial-gradient(circle, rgba(59,111,217,0.09) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: '10%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(124,59,217,0.07) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Back link */}
      <div className="relative z-10 w-full max-w-[420px] mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Volver al inicio
        </Link>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(6, 8, 22, 0.96)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(80,137,255,0.6) 35%, rgba(167,139,250,0.5) 65%, transparent 100%)',
            }}
          />

          <div className="px-8 py-10 sm:px-10">
            {/* Brand + icon */}
            <div className="flex flex-col items-center text-center mb-9">
              {/* Icon */}
              <div
                className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,111,217,0.25) 0%, rgba(124,59,217,0.15) 100%)',
                  border: '1px solid rgba(80,137,255,0.35)',
                  boxShadow: '0 8px 24px rgba(59,111,217,0.2)',
                }}
              >
                {/* GaloDev G monogram */}
                <span className="text-lg font-black text-white/90" style={{ fontFamily: 'var(--font-outfit, sans-serif)', letterSpacing: '-0.05em' }}>G</span>
              </div>

              <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                GaloDev
              </h1>
              <p className="text-[13px] text-white/35 mt-1 font-light">
                Área privada · Herramientas
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <InputField
                id="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChange={setEmail}
                icon={Mail}
                autoComplete="email"
              />

              <InputField
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                icon={Lock}
                autoComplete="current-password"
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-white/25 hover:text-white/55 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#fca5a5',
                      }}
                    >
                      <AlertCircle size={14} className="flex-shrink-0 mt-px" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="relative w-full h-[50px] rounded-xl text-[14px] font-semibold text-white overflow-hidden transition-all duration-200 mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #3b6fd9 0%, #5089ff 100%)',
                  boxShadow: (!loading && email && password) ? '0 8px 32px rgba(59,111,217,0.35)' : 'none',
                }}
              >
                {/* Hover overlay */}
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.07] transition-opacity duration-200" />

                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Verificando…</span>
                    </>
                  ) : (
                    <span>Ingresar al panel</span>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      <p className="relative z-10 text-[11px] text-white/15 mt-6 text-center">
        Acceso exclusivo · GaloDev Utils 2025
      </p>
    </div>
  );
}

/* ── Controlled Input ──────────────────────────────────────────── */

function InputField({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  autoComplete,
  rightAction,
}: {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  autoComplete?: string;
  rightAction?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold tracking-[0.14em] uppercase select-none transition-colors duration-150"
        style={{ color: focused ? 'rgba(130,175,255,0.85)' : 'rgba(255,255,255,0.32)' }}
      >
        {label}
      </label>

      <div
        className="relative flex items-center h-[50px] rounded-xl transition-all duration-200"
        style={{
          background: focused ? 'rgba(59,111,217,0.08)' : 'rgba(255,255,255,0.04)',
          border: focused ? '1px solid rgba(80,137,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(59,111,217,0.12)' : 'none',
        }}
      >
        <Icon
          size={15}
          className="absolute left-4 pointer-events-none transition-colors duration-150 flex-shrink-0"
          style={{ color: focused ? 'rgba(130,175,255,0.65)' : 'rgba(255,255,255,0.2)' }}
        />

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-full pl-11 bg-transparent text-[14px] text-white outline-none"
          style={{
            paddingRight: rightAction ? '44px' : '16px',
            caretColor: '#5089ff',
          }}
        />

        {rightAction && (
          <span className="absolute right-4 flex items-center">{rightAction}</span>
        )}
      </div>
    </div>
  );
}
