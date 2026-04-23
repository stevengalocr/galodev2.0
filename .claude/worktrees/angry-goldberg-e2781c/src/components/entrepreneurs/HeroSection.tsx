'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/providers/language.provider';

export default function HeroSection() {
  const t = useTranslations();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 bg-background">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-[50px] pointer-events-none z-0" />

      {/* Abstract Sphere Line */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none z-0 border border-white/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none z-0 border border-white/10 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-4 text-center z-10 w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span
            style={{
              padding: '10px',
              marginTop: '1.5rem',
              marginBottom: '2.5rem',
            }}
            className="inline-flex items-center justify-center px-10 py-4 mb-10 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-bold backdrop-blur-sm tracking-[0.2em] shadow-lg shadow-primary-500/10 uppercase"
          >
            {t.entrepreneurs.hero.badge}
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight w-11/12 mx-auto">
            {t.entrepreneurs.hero.titlePart1} <br className="hidden md:block" />
            <span className="text-primary-400">{t.entrepreneurs.hero.titleHighlight}</span>
          </h1>

          <p
            style={{
              marginTop: '1.5rem',
            }}
            className="text-lg md:text-2xl text-gray-200 w-11/12 max-w-3xl mx-auto mb-16 leading-relaxed font-light"
          >
            {t.entrepreneurs.hero.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
