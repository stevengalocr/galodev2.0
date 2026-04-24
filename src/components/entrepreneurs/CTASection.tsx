'use client';

import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

import { useTranslations } from '@/providers/language.provider';
import ProposalForm from '@/components/contact/ProposalForm';

export default function CTASection() {
  const t = useTranslations();

  return (
    <section
      style={{ marginTop: '4rem', paddingBottom: '8rem' }}
      className="py-24 px-4 relative bg-background flex flex-col items-center"
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

          <div className="w-full max-w-2xl mx-auto mb-16">
            <ProposalForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
