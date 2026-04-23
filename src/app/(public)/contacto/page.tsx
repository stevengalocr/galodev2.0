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

export default function ContactPage() {
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
    <main className="min-h-screen" style={{ background: '#020412' }}>
      <style>{`
        input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,
        textarea:-webkit-autofill,textarea:-webkit-autofill:hover,textarea:-webkit-autofill:focus{
          -webkit-text-fill-color:white!important;
          -webkit-box-shadow:0 0 0px 1000px rgba(4,8,24,0.98) inset!important;
          transition:background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* ── Background ───────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-space" />
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-blue-700/8 blur-[180px]" />
        <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-indigo-600/8 blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Hero Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ paddingTop: '140px', paddingBottom: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          className="px-6 sm:px-8"
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-1.5 mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.25em]">
              Disponible para nuevos proyectos
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight mb-6">
            Tu idea merece
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400">
              código real.
            </span>
          </h1>
          <p style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }} className="text-base sm:text-lg text-white/45 font-light leading-relaxed">
            Cuéntame qué estás construyendo. Sin formularios genéricos, sin intermediarios.
            Un mensaje directo al desarrollador que lo va a hacer.
          </p>
        </motion.div>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="flex-1" style={{ paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

              {/* ── Left Sidebar ─────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-2 lg:sticky lg:top-28 flex flex-col gap-6"
              >
                {/* Why work with me */}
                <div
                  className="rounded-2xl border border-white/[0.07] flex flex-col gap-5"
                  style={{ background: 'rgba(255,255,255,0.02)', padding: '24px' }}
                >
                  <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">
                    ¿Por qué trabajar conmigo?
                  </h2>
                  {[
                    { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15', title: 'Respuesta en 24 h', desc: 'Evaluación técnica y propuesta económica sin rodeos.' },
                    { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15', title: 'Trato directo', desc: 'Hablas con el desarrollador, no con un account manager.' },
                    { icon: Code2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/15', title: 'Stack moderno', desc: 'Next.js, Go, React, APIs REST. Sin legado sin sentido.' },
                  ].map(({ icon: Icon, color, bg, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${bg}`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold leading-tight mb-0.5">{title}</p>
                        <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct contact links */}
                <div
                  className="rounded-2xl border border-white/[0.07]"
                  style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}
                >
                  <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-4">Contacto rápido</p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/50670460002"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      <span className="text-white/50 text-sm group-hover:text-white transition-colors">+506 7046 0002</span>
                    </a>
                    <a
                      href="mailto:stevengalocr@gmail.com"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Send className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-white/50 text-sm group-hover:text-white transition-colors">stevengalocr@gmail.com</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* ── Form ─────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="lg:col-span-3"
              >
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
                          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                            <p className="text-xs text-red-200">Error de conexión. Intenta de nuevo o escríbeme directo por WhatsApp.</p>
                          </div>
                        )}
                        {status === 'spamError' && (
                          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                            <p className="text-xs text-orange-200">Verificación incorrecta. Volvé a intentarlo.</p>
                          </div>
                        )}
                        {status === 'timeoutError' && (
                          <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
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
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                                  selectedType === id
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
              </motion.div>
            </div>
          </div>
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
              style={{ background: 'rgba(8,10,28,0.98)', backdropFilter: 'blur(24px)' }}
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
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-2 rounded-lg border transition-colors ${
                    timeLeft <= 5
                      ? 'text-red-400 border-red-500/30 bg-red-500/10'
                      : 'text-blue-400 border-white/[0.06] bg-white/[0.03]'
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
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

      {/* Fade to black for footer */}
      <div className="relative z-10 h-32 w-full bg-gradient-to-b from-transparent to-black" />
    </main>
  );
}
