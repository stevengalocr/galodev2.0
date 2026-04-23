'use client';

import { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Timer,
  Zap,
  Clock,
  ArrowRight,
  Code2,
  Globe,
  Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECT_TYPES = [
  { id: 'web', icon: Globe, label: 'App / Sitio Web' },
  { id: 'api', icon: Code2, label: 'API / Backend' },
  { id: 'mobile', icon: Smartphone, label: 'Móvil / Híbrida' },
  { id: 'other', icon: Zap, label: 'Otro / Consultoría' },
];

export default function ProposalForm() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'spamError' | 'timeoutError'
  >('idle');
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingData, setPendingData] = useState<any>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });

  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
    });
  };

  useEffect(() => { generateCaptcha(); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isModalOpen && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    } else if (isModalOpen && timeLeft === 0) {
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus('timeoutError');
        setCaptchaAnswer('');
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isModalOpen, timeLeft]);

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('idle');
    const formData = new FormData(e.currentTarget);
    setPendingData({
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      tipo: selectedType,
      propuesta: formData.get('propuesta'),
      honeypot: formData.get('honeypot'),
    });
    generateCaptcha();
    setCaptchaAnswer('');
    setTimeLeft(20);
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      setIsModalOpen(false);
      setStatus('spamError');
      return;
    }
    setIsModalOpen(false);
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all';

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <div
          className="rounded-2xl border border-white/[0.08] relative overflow-hidden"
          style={{ background: 'rgba(8,10,28,0.7)', backdropFilter: 'blur(24px)', padding: '8px' }}
        >
          {/* Top shimmer */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 px-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20"
                >
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-3">¡Mensaje recibido!</h3>
                <p className="text-white/45 max-w-xs mb-8 leading-relaxed text-sm">
                  Ya tengo tu propuesta. Te contactaré en menos de 24 horas para coordinar los detalles.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setSelectedType(''); }}
                  className="px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium hover:bg-white/10 transition-colors text-white"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleInitialSubmit}
                className="flex flex-col gap-5"
                style={{ padding: '28px' }}
              >
                {/* Alerts */}
                {status === 'error' && (
                  <div style={{
                    padding: '10px',
                  }} className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-200">Error de conexión. Intenta de nuevo o escríbeme directo por WhatsApp.</p>
                  </div>
                )}
                {status === 'spamError' && (
                  <div style={{
                    padding: '10px',
                  }} className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                    <p className="text-xs text-orange-200">Verificación incorrecta. Volvé a intentarlo.</p>
                  </div>
                )}
                {status === 'timeoutError' && (
                  <div style={{
                    padding: '10px',
                  }} className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                    <Timer className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <p className="text-xs text-yellow-200">Se acabó el tiempo de verificación. Enviá el formulario de nuevo.</p>
                  </div>
                )}

                {/* Step: Type of project */}
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
                    ¿Qué tipo de proyecto tenés?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PROJECT_TYPES.map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedType(id === selectedType ? '' : id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${selectedType === id
                          ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                          : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/60 hover:bg-white/[0.04]'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nombre" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      Nombre
                    </label>
                    <input
                      style={{ padding: '1rem' }}
                      type="text"
                      name="nombre"
                      id="nombre"
                      placeholder="Tu nombre completo"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      Correo
                    </label>
                    <input
                      style={{ padding: '1rem' }}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="tu@empresa.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telefono" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    style={{ padding: '1rem' }}
                    type="tel"
                    name="telefono"
                    id="telefono"
                    placeholder="+506 8888 8888"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="propuesta" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    Cuéntame tu proyecto
                  </label>
                  <textarea
                    style={{ padding: '1rem' }}
                    name="propuesta"
                    id="propuesta"
                    rows={5}
                    required
                    placeholder="¿Qué querés construir? ¿Cuál es el problema que resuelve? Si tenés presupuesto o timeline en mente, también podés mencionarlo."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Honeypot */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input type="text" name="honeypot" id="honeypot" tabIndex={-1} autoComplete="off" />
                </div>

                {/* ── Submit Section ──────────────────────────── */}
                <div style={{ paddingTop: '12px' }} className="flex flex-col gap-4">
                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Confidentiality badge */}
                  <div className="flex items-center justify-center gap-2" style={{ padding: '4px 0' }}>
                    <ShieldCheck className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                    <p className="text-[10px] text-white/25 uppercase tracking-[0.15em]">
                      Información tratada con total confidencialidad
                    </p>
                  </div>

                  {/* Full-width premium button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative w-full flex items-center justify-center gap-3 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.5)] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden"
                    style={{
                      padding: '18px 32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                      boxShadow: '0 4px 24px -4px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Procesando tu propuesta...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 transition-transform group-hover:-rotate-12 group-hover:scale-110 duration-300" />
                        <span>Enviar Propuesta</span>
                        <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1 duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CAPTCHA MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] p-8 flex flex-col items-center text-center gap-5"
              style={{
                padding: '10px',
                background: 'rgba(8,10,28,0.98)', backdropFilter: 'blur(24px)'
              }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-blue-400" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white mb-1">Verificación rápida</h3>
                <p className="text-white/35 text-xs leading-relaxed">
                  Resolvé esta suma para confirmar que sos humano.
                </p>
              </div>

              <div className="w-full flex items-center justify-center bg-white/[0.03] rounded-xl py-5 border border-white/[0.06] text-3xl font-black text-white tracking-widest">
                {captcha.num1} + {captcha.num2} = ?
              </div>

              <div className="w-full relative">
                <input
                  type="number"
                  autoFocus
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleFinalSubmit(); } }}
                  placeholder="Tu respuesta"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-5 pr-28 py-4 text-center text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-2 rounded-lg border transition-colors ${timeLeft <= 5
                    ? 'text-red-400 border-red-500/30 bg-red-500/10'
                    : 'text-blue-400 border-white/[0.06] bg-white/[0.03]'
                    }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
              </div>

              <div
                style={{
                  padding: '10px',
                }}
                className="flex gap-3 w-full">
                <button
                  style={{
                    padding: '10px',
                  }}
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!captchaAnswer}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
