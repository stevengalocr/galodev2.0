'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/providers/language.provider';

export default function ValueProposition() {
  const t = useTranslations();

  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent pointer-events-none" />

      <div className="mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </section>
  );
}
