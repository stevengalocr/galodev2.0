'use client';

import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';

import { useTranslations } from '@/providers/language.provider';

export default function CTASection() {
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
  // ... rest of handleSubmit logic keeps same

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
    <section
      style={{
        marginTop: '4rem',
      }}
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
          <h2 className="w-full text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
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
    </section>
  );
}
