'use client';

import { motion } from 'framer-motion';
import type { PostType } from '@/lib/crear-post/types';
import { Clock, DollarSign, Layers, LayoutGrid, Image, AlignLeft, Megaphone } from 'lucide-react';

interface Props {
  onSelect: (type: PostType) => void;
}

const TYPE_CARDS = [
  {
    id: 'carrusel' as PostType,
    icon: LayoutGrid,
    title: 'Carrusel',
    description: 'Tema con varios puntos, lista o comparativa. Ideal para educación.',
    slides: '4–8 slides',
    tiempo: '~2 min',
    costoEst: '~$0.60',
    acento: '#3B82F6',
    acentoBg: 'rgba(59,111,217,0.12)',
    acentoBorder: 'rgba(80,137,255,0.32)',
    shimmer: 'from-transparent via-blue-500/40 to-transparent',
  },
  {
    id: 'post_unico' as PostType,
    icon: Image,
    title: 'Post único',
    description: 'Una imagen con un mensaje poderoso y directo.',
    slides: '1 slide',
    tiempo: '~30 seg',
    costoEst: '~$0.15',
    acento: '#10B981',
    acentoBg: 'rgba(16,185,129,0.1)',
    acentoBorder: 'rgba(16,185,129,0.28)',
    shimmer: 'from-transparent via-emerald-500/40 to-transparent',
  },
  {
    id: 'story' as PostType,
    icon: AlignLeft,
    title: 'Story serie',
    description: '3–5 slides verticales pensados para Stories de Instagram.',
    slides: '3–5 slides',
    tiempo: '~1 min',
    costoEst: '~$0.57',
    acento: '#F59E0B',
    acentoBg: 'rgba(245,158,11,0.09)',
    acentoBorder: 'rgba(245,158,11,0.28)',
    shimmer: 'from-transparent via-amber-500/40 to-transparent',
  },
  {
    id: 'anuncio' as PostType,
    icon: Megaphone,
    title: 'Anuncio / Venta',
    description: '5 slides enfocados a conversión. Para lanzar un servicio o producto.',
    slides: '5 slides',
    tiempo: '~1.5 min',
    costoEst: '~$0.71',
    acento: '#8B5CF6',
    acentoBg: 'rgba(139,92,246,0.1)',
    acentoBorder: 'rgba(139,92,246,0.28)',
    shimmer: 'from-transparent via-violet-500/40 to-transparent',
  },
] as const;

export default function StepTypeSelector({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="w-full max-w-[720px] mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(130,175,255,0.6)' }}>
          Paso 1 de 4
        </p>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-white leading-tight tracking-tight mb-2">
          ¿Qué tipo de post querés crear?
        </h2>
        <p className="text-[14px] text-white/35">Elegí el formato y arrancamos.</p>
      </div>

      <div style={{padding:'2rem'}} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {TYPE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onSelect(card.id)}
              className="group text-left relative rounded-2xl overflow-hidden transition-all duration-250 cursor-pointer"
              style={{
                background: 'rgba(5,7,20,0.96)',
                border: `1px solid ${card.acentoBorder}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.45), 0 0 32px ${card.acentoBg}`;
                el.style.border = `1px solid ${card.acento}55`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
                el.style.border = `1px solid ${card.acentoBorder}`;
              }}
            >
              {/* Top shimmer */}
              <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${card.shimmer}`} />

              {/* Glow blob */}
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${card.acentoBg} 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />

              <div style={{ padding: '1rem' }} className="relative p-6">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: card.acentoBg,
                    border: `1px solid ${card.acentoBorder}`,
                  }}
                >
                  <Icon size={18} style={{ color: card.acento }} />
                </div>

                {/* Text */}
                <h3 className="text-[16px] font-bold text-white mb-1.5">{card.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-5">
                  {card.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[11.5px] text-white/22">
                  <span className="flex items-center gap-1.5">
                    <Layers size={10} />
                    {card.slides}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={10} />
                    {card.tiempo}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={10} />
                    {card.costoEst}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
