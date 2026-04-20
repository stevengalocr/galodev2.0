'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Wrench } from 'lucide-react';

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
    >
      {/* Space background */}
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(59,111,217,0.12) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 35% at 85% 85%, rgba(124,59,217,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 30% 25% at 15% 70%, rgba(80,137,255,0.06) 0%, transparent 55%)',
          ].join(','),
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/60 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
          <span>Volver al inicio</span>
        </Link>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(8, 11, 24, 0.9)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow:
              '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Top gradient accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(80,137,255,0.5) 40%, rgba(124,59,217,0.4) 60%, transparent)',
            }}
          />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59,111,217,0.2) 0%, rgba(124,59,217,0.1) 100%)',
                  border: '1px solid rgba(80,137,255,0.3)',
                  boxShadow: '0 8px 24px rgba(59,111,217,0.15)',
                }}
              >
                <Wrench size={22} style={{ color: 'var(--color-primary-300, #7baeff)' }} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                Área Privada
              </h1>
              <p className="text-sm text-white/35 font-light">GaloDev · Herramientas internas</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Email */}
              <InputField
                id="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChange={(v) => setEmail(v)}
                icon={<Mail size={15} />}
                autoComplete="email"
              />

              {/* Password */}
              <InputField
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(v) => setPassword(v)}
                icon={<Lock size={15} />}
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/25 hover:text-white/55 transition-colors duration-150"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm"
                  style={{
                    background: 'rgba(239,68,68,0.07)',
                    border: '1px solid rgba(239,68,68,0.18)',
                    color: '#fca5a5',
                  }}
                >
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 mt-1 overflow-hidden group disabled:opacity-45 disabled:cursor-not-allowed"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59,111,217,0.95) 0%, rgba(80,137,255,0.85) 100%)',
                  border: '1px solid rgba(80,137,255,0.35)',
                  boxShadow: loading ? 'none' : '0 8px 28px rgba(59,111,217,0.28)',
                }}
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                      </svg>
                      Verificando...
                    </>
                  ) : (
                    'Ingresar al panel'
                  )}
                </span>
              </button>
            </form>
          </div>
        </motion.div>

        <p className="text-center text-xs text-white/15 mt-6">
          Acceso exclusivo · GaloDev Utils
        </p>
      </div>
    </div>
  );
}

/* ── Input Field Component ──────────────────────────────────────── */

function InputField({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon,
  autoComplete,
  rightElement,
}: {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-150"
        style={{ color: focused ? 'rgba(120,167,255,0.8)' : 'rgba(255,255,255,0.35)' }}
      >
        {label}
      </label>

      <div
        className="relative flex items-center rounded-xl transition-all duration-200"
        style={{
          background: focused
            ? 'rgba(59,111,217,0.07)'
            : hasValue
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(255,255,255,0.025)',
          border: focused
            ? '1px solid rgba(80,137,255,0.45)'
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(59,111,217,0.1)' : 'none',
        }}
      >
        {/* Left icon */}
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-150 pointer-events-none"
          style={{ color: focused ? 'rgba(120,167,255,0.7)' : 'rgba(255,255,255,0.22)' }}
        >
          {icon}
        </span>

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
          className="w-full pl-11 pr-11 py-3.5 bg-transparent text-sm text-white outline-none placeholder-white/20"
        />

        {/* Right element */}
        {rightElement && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</span>
        )}
      </div>
    </div>
  );
}
