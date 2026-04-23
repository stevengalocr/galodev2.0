'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, ChevronLeft } from 'lucide-react';

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

  const ready = !loading && email.trim() && password.trim();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <style dangerouslySetInnerHTML={{
        __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 60px #0A0D20 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}} />

      {/* ── Background ───────────────────────────────────────────── */}
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

      {/* ── Ambient glows ────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-200 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Volver al inicio
        </Link>
      </div>

      {/* ── Card ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
        style={{ padding: '24px' }}
      >
        <div className="bg-[#050714]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden p-8 sm:p-14 relative">

          {/* Subtle top gradient line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center mb-10"
            style={{ margin: '16px' }}>
            {/* <div className="relative w-36 h-36 mb-0"> */}
            {/* <Image
                src="/galodev_lock_3d.png"
                alt="3D Security Lock"
                fill
                className="object-contain scale-[1.3] mix-blend-screen"
                priority
                unoptimized
              /> */}
            {/* </div> */}

            <h1 className="text-3xl font-bold text-white tracking-tight mb-4">
              GaloDev
            </h1>

            <div style={{ margin: '6px' }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck size={14} className="text-blue-400" />
              <span className="text-xs font-medium text-blue-200 tracking-wide">
                Área Privada · Herramientas
              </span>
            </div>
          </div>

          {/* ── Form ──────────────────────────────────────────── */}
          <form onSubmit={handleLogin} className="flex flex-col gap-6"
            style={{ padding: '16px' }}>

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
                  className="text-white/40 hover:text-white transition-colors p-2"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm mt-2">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!ready}
              className={`
                relative w-full h-[60px] rounded-2xl text-sm font-bold text-white overflow-hidden transition-all duration-300 mt-4
                flex items-center justify-center gap-2
                ${ready
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_8px_30px_rgba(59,130,246,0.3)]'
                  : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ingresar al panel</span>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      <p className="relative z-10 text-xs text-white/30 mt-12 text-center tracking-wider">
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
  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={id}
        className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 ml-2"
      >
        {label}
      </label>

      <div className="relative flex items-center group">
        <Icon
          size={20}
          className="absolute left-5 text-white/30 group-focus-within:text-blue-400 transition-colors pointer-events-none"
        />

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          className="w-full h-[60px] bg-[#0A0D20]/80 border border-white/10 focus:border-blue-500/50 focus:bg-[#0A0D20] focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-xl text-[15px] text-white outline-none transition-all placeholder:text-white/20"
          style={{ paddingLeft: '56px', paddingRight: rightAction ? '56px' : '20px' }}
        />

        {rightAction && (
          <span className="absolute right-3 flex items-center">{rightAction}</span>
        )}
      </div>
    </div>
  );
}
