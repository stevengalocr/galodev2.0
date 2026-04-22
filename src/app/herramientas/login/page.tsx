'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function HerramientasLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
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

  const ready = !loading && email.trim() && password.trim();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-5 py-12">

      {/* ── Background ───────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      {/* ── Ambient glows ────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-center soft blue */}
        <div className="absolute rounded-full" style={{
          width: 800, height: 800,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -62%)',
          background: 'radial-gradient(circle, rgba(59,111,217,0.11) 0%, transparent 60%)',
        }} />
        {/* Bottom-right accent purple */}
        <div className="absolute rounded-full" style={{
          width: 500, height: 500,
          bottom: '-5%', right: '-5%',
          background: 'radial-gradient(circle, rgba(124,59,217,0.08) 0%, transparent 65%)',
        }} />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
      </div>

      {/* ── Back link ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[460px] mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/55 transition-colors duration-200 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Volver al inicio
        </Link>
      </div>

      {/* ── Card ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(5, 7, 20, 0.97)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.06) inset',
          }}
        >
          {/* Shimmer top line */}
          <div className="absolute top-0 inset-x-0 h-px" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(59,111,217,0.7) 30%, rgba(167,139,250,0.55) 65%, transparent 100%)',
          }} />

          {/* Inner glow — top-center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at top, rgba(59,111,217,0.12) 0%, transparent 70%)',
          }} />

          <div className="px-10 pt-10 pb-10">

            {/* ── Brand ─────────────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-9">

              {/* Icon with layered rings */}
              <div className="relative mb-5">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-[18px] scale-[1.22]" style={{
                  border: '1px solid rgba(80,137,255,0.12)',
                }} />
                {/* Mid ring */}
                <div className="absolute inset-0 rounded-[18px] scale-[1.1]" style={{
                  border: '1px solid rgba(80,137,255,0.2)',
                }} />
                {/* Icon body */}
                <div
                  className="relative w-[56px] h-[56px] rounded-[16px] flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, rgba(59,111,217,0.28) 0%, rgba(124,59,217,0.18) 100%)',
                    border: '1px solid rgba(80,137,255,0.4)',
                    boxShadow: '0 8px 32px rgba(59,111,217,0.28), 0 0 0 1px rgba(80,137,255,0.15) inset',
                  }}
                >
                  <span
                    className="text-[22px] font-black text-white"
                    style={{ fontFamily: 'var(--font-outfit, sans-serif)', letterSpacing: '-0.06em' }}
                  >G</span>
                </div>
              </div>

              <h1 className="text-[23px] font-bold text-white tracking-tight leading-none mb-2">
                GaloDev
              </h1>

              {/* Access badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(59,111,217,0.1)',
                  border: '1px solid rgba(80,137,255,0.2)',
                }}
              >
                <ShieldCheck size={10} style={{ color: 'rgba(130,175,255,0.7)' }} />
                <span className="text-[11px] font-medium" style={{ color: 'rgba(130,175,255,0.7)' }}>
                  Área privada · Herramientas
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)' }} />

            {/* ── Form ──────────────────────────────────────────── */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

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
                    onClick={() => setShowPassword(p => !p)}
                    className="text-white/25 hover:text-white/55 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.22)',
                        color: '#fca5a5',
                      }}
                    >
                      <AlertCircle size={14} className="flex-shrink-0 mt-px" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={!ready}
                className="relative w-full h-[52px] rounded-xl text-[14px] font-semibold text-white overflow-hidden transition-all duration-300 mt-1 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{
                  background: ready
                    ? 'linear-gradient(135deg, #2d5ec7 0%, #4a7fff 50%, #5a8fff 100%)'
                    : 'linear-gradient(135deg, #2a3a60 0%, #2d4070 100%)',
                  boxShadow: ready ? '0 8px 36px rgba(59,111,217,0.4), 0 0 0 1px rgba(80,137,255,0.2) inset' : 'none',
                }}
              >
                {/* Shine sweep */}
                {ready && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                )}
                {/* Hover darken */}
                <span className="absolute inset-0 bg-black opacity-0 hover:opacity-[0.06] transition-opacity duration-200" />

                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-[15px] h-[15px] opacity-80" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Verificando…
                    </>
                  ) : (
                    'Ingresar al panel'
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <p className="relative z-10 text-[11px] text-white/12 mt-7 text-center tracking-wide">
        Acceso exclusivo · GaloDev Utils 2025
      </p>
    </div>
  );
}

/* ── Input component ─────────────────────────────────────────────── */

function InputField({
  id, type, label, placeholder, value, onChange, icon: Icon, autoComplete, rightAction,
}: {
  id: string; type: string; label: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon: React.ElementType;
  autoComplete?: string; rightAction?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10.5px] font-bold tracking-[0.15em] uppercase select-none transition-colors duration-150"
        style={{ color: active ? 'rgba(130,175,255,0.9)' : 'rgba(255,255,255,0.28)' }}
      >
        {label}
      </label>

      <div
        className="relative flex items-center h-[50px] rounded-xl transition-all duration-200"
        style={{
          background: focused
            ? 'rgba(59,111,217,0.09)'
            : value
            ? 'rgba(59,111,217,0.05)'
            : 'rgba(255,255,255,0.03)',
          border: focused
            ? '1px solid rgba(80,137,255,0.55)'
            : value
            ? '1px solid rgba(80,137,255,0.22)'
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(59,111,217,0.13)' : 'none',
        }}
      >
        <Icon
          size={14}
          className="absolute left-4 pointer-events-none flex-shrink-0 transition-colors duration-150"
          style={{ color: active ? 'rgba(130,175,255,0.6)' : 'rgba(255,255,255,0.18)' }}
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
          className="w-full h-full pl-[42px] bg-transparent text-[14px] text-white outline-none placeholder:text-white/20"
          style={{ paddingRight: rightAction ? '44px' : '16px', caretColor: '#5089ff' }}
        />

        {rightAction && (
          <span className="absolute right-4 flex items-center">{rightAction}</span>
        )}
      </div>
    </div>
  );
}
