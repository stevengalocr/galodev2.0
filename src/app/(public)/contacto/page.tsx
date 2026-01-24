'use client';

import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';

import { useTranslations } from '@/providers/language.provider';

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Hidden field for spam bots
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) newErrors.name = t.contact.form.errors.nameRequired;
    else if (formData.name.length < 2) newErrors.name = t.contact.form.errors.nameShort;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = t.contact.form.errors.emailRequired;
    else if (!emailRegex.test(formData.email)) newErrors.email = t.contact.form.errors.emailInvalid;

    // Message validation
    if (!formData.message.trim()) newErrors.message = t.contact.form.errors.messageRequired;
    else if (formData.message.length < 10) newErrors.message = t.contact.form.errors.messageShort;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. Honeypot check (Silent block for bots)
    if (formData.honeypot) {
      console.log('Bot detected.');
      return;
    }

    // 2. Validation
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Construct mailto link
    const subject = `Nuevo mensaje de ${formData.name} (Web)`;
    const body = `Nombre: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AMensaje: ${formData.message}`;

    // Slight delay to show loading state if desired, then redirect
    setTimeout(() => {
      window.location.href = `mailto:stevengalocr@gmail.com?subject=${subject}&body=${body}`;
      setIsSubmitting(false);
      // Optional: Reset form
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      setErrors({});
    }, 500);
  };

  return (
    <main
      style={{ paddingTop: '10rem' }}
      className="min-h-screen pt-36 pb-24 relative bg-background flex flex-col items-center overflow-hidden"
    >
      {/* Fixed Star Background matching Home/Entrepreneurs */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-space" />
      </div>

      {/* Hero Glow Effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-[50px] pointer-events-none z-0" />

      {/* Abstract Sphere Line */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none z-0 border border-white/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none z-0 border border-white/10 rounded-full" />

      <div className="w-11/12 max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col items-center"
        >
          <h1 className="w-full text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t.contact.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed max-w-2xl">
            {t.contact.ctaTitle} {t.contact.ctaDescription}
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
              href="mailto:stevengalocr@gmail.com"
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 hover:bg-primary-500/20 hover:border-primary-500/50 hover:text-primary-400 text-gray-300 transition-all duration-300 text-2xl"
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
          <div className="w-full max-w-lg mx-auto">
            <form
              style={{ padding: '1.5rem', marginBottom: '4rem' }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl relative"
            >
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
                  placeholder={t.contact.form.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-black/60 transition-all`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs text-left mt-1 ml-2">{errors.name}</p>
                )}
              </div>

              <div className="w-full">
                <input
                  style={{ padding: '1rem' }}
                  type="email"
                  placeholder={t.contact.form.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-black/60 transition-all`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs text-left mt-1 ml-2">{errors.email}</p>
                )}
              </div>

              <div className="w-full">
                <textarea
                  style={{ padding: '1rem' }}
                  placeholder={t.contact.form.messagePlaceholder}
                  rows={3}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  className={`w-full px-5 py-4 rounded-xl bg-black/40 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-black/60 transition-all resize-none`}
                />
                {errors.message && (
                  <p className="text-red-400 text-xs text-left mt-1 ml-2">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                }}
                className={`w-full mt-2 flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-primary-500/20 hover:border-primary-500/50 text-white font-bold rounded-xl shadow-lg shadow-black/20 transition-all duration-300 transform ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                <span>{isSubmitting ? t.contact.form.submitting : t.contact.form.submit}</span>
                {!isSubmitting && <FiSend />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
