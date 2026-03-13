'use client';

import { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Timer,
} from 'lucide-react';

export default function ContactForm() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'spamError' | 'timeoutError'
  >('idle');

  // Modal Anti-Spam States
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

  useEffect(() => {
    setTimeout(() => {
      generateCaptcha();
    }, 0);
  }, []);

  // Timer Effect para el Modal
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isModalOpen && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isModalOpen && timeLeft === 0) {
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus('timeoutError');
        setCaptchaAnswer('');
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isModalOpen, timeLeft]);

  // Submit Inicial: Abre el modal
  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      propuesta: formData.get('propuesta'),
      honeypot: formData.get('honeypot'), // Campo trampa oculto
    };

    setPendingData(data);
    generateCaptcha();
    setCaptchaAnswer('');
    setTimeLeft(20);
    setIsModalOpen(true);
  };

  // Submit Final: Valida el modal y envía a la API
  const handleFinalSubmit = async () => {
    // Validar el Captcha Humano
    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      setIsModalOpen(false);
      setStatus('spamError');
      return;
    }

    setIsModalOpen(false);
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <section
        id="form"
        className="relative pt-24 pb-8 sm:pt-32 sm:pb-12 min-h-screen overflow-hidden flex items-center justify-center border-t border-zinc-800"
      >
        {/* Background Replacement */}
        <div className="absolute inset-0 z-0">
          {/* Base Space Pattern */}
          <div className="absolute inset-0 bg-space" />
          
          {/* Subtle Glows to blend beautifully - CHANGED TO BLUE */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-zinc-500/10 rounded-full blur-[80px] pointer-events-none z-0" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/80 to-zinc-950/90 pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Columna Izquierda: Mensaje */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 pt-4">
              <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white mb-6">
                Envíanos tu <br />{' '}
                <span className="font-semibold text-white">Propuesta</span>
              </h1>
              <p className="text-xl text-zinc-400 font-light leading-relaxed mb-8">
                Inicie su proceso de negociación directa. Complete sus datos
                corporativos y detalle su intención de compra o propuesta para su proyecto.
              </p>
              <div className="inline-flex items-center space-x-2 rounded border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span className="text-xs font-semibold text-blue-100 uppercase tracking-widest pl-2">
                  Trato Directo • Confidencial
                </span>
              </div>
            </div>

            {/* Columna Derecha: Formulario Limpio y Elegante */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center animation-fade-in">
                    <CheckCircle className="h-16 w-16 text-blue-500 mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Propuesta Enviada
                    </h3>
                    <p className="text-zinc-400">
                      Hemos recibido su información correctamente. Nuestro
                      equipo se pondrá en contacto pronto.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-8 px-6 py-2 rounded-full border border-zinc-700 text-sm font-medium hover:bg-zinc-800 transition-colors text-white"
                    >
                      Enviar otra propuesta
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInitialSubmit} className="space-y-8">
                    {status === 'error' && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200">
                          Hubo un error al enviar su propuesta. Por favor
                          intente de nuevo más tarde o asegúrese de que sus
                          datos son correctos.
                        </p>
                      </div>
                    )}

                    {status === 'spamError' && (
                      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-200">
                          La verificación de seguridad fue incorrecta. Intente
                          de nuevo.
                        </p>
                      </div>
                    )}

                    {status === 'timeoutError' && (
                      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                        <Timer className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-200">
                          El tiempo de validación se agotó. Por favor envíe la
                          propuesta nuevamente.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div>
                        <label htmlFor="nombre" className="sr-only">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          id="nombre"
                          placeholder="Nombre Completo *"
                          required
                          className="block w-full border-0 border-b border-zinc-700 bg-transparent px-0 py-3 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-0 sm:text-base outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="sr-only">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Correo Electrónico *"
                          required
                          className="block w-full border-0 border-b border-zinc-700 bg-transparent px-0 py-3 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-0 sm:text-base outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="telefono" className="sr-only">
                        Teléfono / WhatsApp Remitente
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        id="telefono"
                        placeholder="Teléfono / WhatsApp Directo *"
                        required
                        className="block w-full border-0 border-b border-zinc-700 bg-transparent px-0 py-3 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-0 sm:text-base outline-none transition-colors"
                      />
                    </div>

                    <div className="pt-2">
                      <label
                        htmlFor="propuesta"
                        className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3"
                      >
                        Detalle de su Propuesta Comercial *
                      </label>
                      <textarea
                        name="propuesta"
                        id="propuesta"
                        rows={5}
                        required
                        placeholder="Describa su intención de compra o presupuesto estimado..."
                        className="block w-full rounded-xl border border-zinc-700 bg-zinc-950/50 p-5 text-white text-base font-light placeholder:text-zinc-600 focus:border-blue-500 focus:ring-0 transition-all resize-none shadow-inner outline-none"
                      />
                    </div>

                    {/* Campo Trampa Oculto (Honeypot) */}
                    <div
                      style={{
                        display: 'none',
                        position: 'absolute',
                        left: '-9999px',
                      }}
                      aria-hidden="true"
                    >
                      <label htmlFor="honeypot">No llenar este campo</label>
                      <input
                        type="text"
                        name="honeypot"
                        id="honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest max-w-[200px]">
                        Manejado bajo estricto principio de secreto industrial
                      </p>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="group flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed w-full sm:w-auto shadow-lg"
                      >
                        {status === 'loading' ? (
                          <>
                            Enviando...
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />
                          </>
                        ) : (
                          <>
                            Enviar Propuesta{' '}
                            <Send className="h-4 w-4 text-zinc-600 group-hover:text-zinc-900 transition-colors" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPTCHA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center transform transition-all gap-6">
            <div className="w-16 h-16 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-light text-white">
                Verificación de Seguridad
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Para garantizar que es una propuesta real, por favor resuelve esta
                sencilla suma antes de que se agote el tiempo.
              </p>
            </div>

            <div className="w-full flex items-center justify-center bg-zinc-950 rounded-2xl py-6 border border-zinc-800 text-4xl font-semibold text-white tracking-widest shadow-inner min-h-[5rem]">
              {captcha.num1} + {captcha.num2}
            </div>

            <div className="w-full relative">
              <input
                type="number"
                autoFocus
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFinalSubmit();
                  }
                }}
                placeholder="Resultado de la suma"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-6 pr-32 py-5 text-center text-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors min-h-[4.5rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              {/* Timer Indicator */}
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-mono text-lg font-medium transition-colors bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 ${timeLeft <= 5 ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-zinc-300'}`}
              >
                <Timer className="w-5 h-5" />
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="flex gap-4 w-full mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 px-2 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors min-h-[3.5rem]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!captchaAnswer}
                className="flex-1 py-4 px-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 min-h-[3.5rem]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
