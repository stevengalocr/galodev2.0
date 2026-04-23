'use client';

import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { ShieldCheck, Timer, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

import { useTranslations } from '@/providers/language.provider';

export default function CTASection() {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefono: '',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'timeoutError' | 'spamError'>(
    'idle'
  );

  // States para Modal Anti-Spam
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
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

  // Control del timer del modal
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isModalOpen && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isModalOpen && timeLeft === 0) {
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitting(false);
        setStatus('timeoutError');
        setCaptchaAnswer('');
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isModalOpen, timeLeft]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = t.contact.form.errors.nameRequired;
    else if (formData.name.length < 2) newErrors.name = t.contact.form.errors.nameShort;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = t.contact.form.errors.emailRequired;
    else if (!emailRegex.test(formData.email)) newErrors.email = t.contact.form.errors.emailInvalid;

    if (!formData.telefono.trim()) newErrors.telefono = t.contact.form.errors.phoneRequired;

    if (!formData.message.trim()) newErrors.message = t.contact.form.errors.messageRequired;
    else if (formData.message.length < 10) newErrors.message = t.contact.form.errors.messageShort;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    if (isSubmitting) return;

    if (formData.honeypot) {
      console.log('Bot detected.');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    generateCaptcha();
    setCaptchaAnswer('');
    setTimeLeft(20);
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      setIsModalOpen(false);
      setIsSubmitting(false);
      setStatus('spamError');
      return;
    }

    setIsModalOpen(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          telefono: formData.telefono,
          propuesta: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ name: '', email: '', telefono: '', message: '', honeypot: '' });
        setErrors({});
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        style={{ marginTop: '4rem' }}
        className="py-24 px-4 relative overflow-hidden bg-background flex flex-col items-center"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-primary-900/20 to-transparent pointer-events-none" />

        <div className="w-full px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto flex flex-col items-center text-center"
          >
            <h2
              className="w-full text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ padding: '8px' }}
            >
              {t.contact.ctaTitle}
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
              {t.contact.ctaDescription}
            </p>

            {/* Contact Links */}
            <div style={{ padding: '1.5rem' }} className="flex flex-wrap justify-center gap-6 mb-12">
              <a
                href="https://wa.me/50670460002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 hover:text-[#25D366] text-gray-300 transition-all duration-300 text-2xl"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="mailto:galodevcr@gmail.com"
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 text-gray-300 transition-all duration-300 text-2xl"
                aria-label="Email"
              >
                <FiMail />
              </a>
              <a
                href="https://instagram.com/GaloDevCR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 hover:bg-[#E1306C]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C] text-gray-300 transition-all duration-300 text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Micro Form */}
            <div className="w-full max-w-lg mx-auto" style={{ padding: '32px' }}>
              {status === 'success' ? (
                <div
                  className="bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl relative rounded-3xl p-8 flex flex-col items-center justify-center text-center animation-fade-in"
                  style={{ padding: '2rem', marginBottom: '4rem' }}
                >
                  <CheckCircle className="h-16 w-16 text-blue-500 mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {t.contact.form.successTitle}
                  </h3>
                  <p className="text-zinc-400 mb-6">{t.contact.form.successMessage}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2 rounded-full border border-zinc-700 text-sm font-medium hover:bg-zinc-800 transition-colors text-white"
                  >
                    {t.contact.form.resetButton}
                  </button>
                </div>
              ) : (
                <form
                  style={{ padding: '1.5rem', marginBottom: '4rem' }}
                  onSubmit={handleInitialSubmit}
                  className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl relative"
                >
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-left">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-200">{t.contact.form.errorConnection}</p>
                    </div>
                  )}

                  {status === 'spamError' && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3 text-left">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-200">{t.contact.form.errorSpam}</p>
                    </div>
                  )}

                  {status === 'timeoutError' && (
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3 text-left">
                      <Timer className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-200">{t.contact.form.errorTimeout}</p>
                    </div>
                  )}

                  {/* Honeypot field (hidden) */}
                  <input
                    type="text"
                    name="honeypot"
                    className="hidden"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="w-full">
                    <input
                      style={{ padding: '1rem' }}
                      type="text"
                      required
                      placeholder={t.contact.form.fullNamePlaceholder}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs text-left mt-1 ml-2">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                      <input
                        style={{ padding: '1rem' }}
                        type="email"
                        required
                        placeholder={t.contact.form.emailFieldPlaceholder}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs text-left mt-1 ml-2">{errors.email}</p>
                      )}
                    </div>

                    <div className="w-full">
                      <input
                        style={{ padding: '1rem' }}
                        type="tel"
                        required
                        placeholder={t.contact.form.phonePlaceholder}
                        value={formData.telefono}
                        onChange={(e) => {
                          setFormData({ ...formData, telefono: e.target.value });
                          if (errors.telefono) setErrors({ ...errors, telefono: '' });
                        }}
                        className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.telefono ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all`}
                      />
                      {errors.telefono && (
                        <p className="text-red-400 text-xs text-left mt-1 ml-2">
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <textarea
                      style={{ padding: '1rem' }}
                      placeholder={t.contact.form.messageDetailPlaceholder}
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs text-left mt-1 ml-2">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ marginTop: '0.5rem', padding: '0.5rem' }}
                    className={`w-full mt-2 flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-blue-500/20 hover:border-blue-500/50 text-white font-bold rounded-xl shadow-lg shadow-black/20 transition-all duration-300 transform ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  >
                    <span>{isSubmitting ? t.contact.form.submittingForm : t.contact.form.submit}</span>
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FiSend className="h-5 w-5" />
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CAPTCHA MODAL ANTI-SPAM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setIsSubmitting(false);
            }}
          ></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center transform transition-all gap-6">
            <div className="w-16 h-16 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-light text-white">{t.contact.form.captchaTitle}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t.contact.form.captchaDescription}
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
                placeholder={t.contact.form.captchaPlaceholder}
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
                onClick={() => {
                  setIsModalOpen(false);
                  setIsSubmitting(false);
                }}
                className="flex-1 py-4 px-2 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors min-h-[3.5rem]"
              >
                {t.contact.form.captchaCancel}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!captchaAnswer}
                className="flex-1 py-4 px-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 min-h-[3.5rem]"
              >
                {t.contact.form.captchaConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
