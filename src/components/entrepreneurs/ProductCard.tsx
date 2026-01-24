'use client';

import { Product } from '@/data/products';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  // Helper to safely generate Tailwind classes (since dynamic interpolation doesn't work with JIT)
  const getScaleClass = (scale?: number) => {
    if (scale === 1.5) return 'scale-[1.5] group-hover:scale-[1.55]';
    if (scale === 1.3) return 'scale-[1.3] group-hover:scale-[1.35]';
    if (scale === 1.2) return 'scale-[1.2] group-hover:scale-[1.25]';
    return 'scale-100 group-hover:scale-105';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-auto w-full relative group"
    >
      {/* Glow Effect behind card */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glass Card Container matching Navigation Dock */}
      <div
        className="relative overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-2 group"
        style={{
          margin: '0.8rem',
          paddingBottom: '1.5rem',
          borderRadius: '1.5rem',
          background: 'rgba(10, 10, 20, 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Image Section - Transparent blend */}
        <div className="relative h-56 w-full overflow-hidden">
          {/* Subtle Gradient for text readability only at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(10,10,20,0.8)] to-transparent z-10" />

          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover object-top transform transition-transform duration-700 opacity-90 group-hover:opacity-100 ${getScaleClass(product.imageScale)}`}
          />
          {/* Overlay Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span
              style={{ padding: '0.4rem 0.8rem' }}
              className="text-[10px] font-bold tracking-widest text-white uppercase bg-black/40 backdrop-blur-md border border-white/10 rounded-full"
            >
              {product.targetAudience}
            </span>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow items-center text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
            {product.title}
          </h3>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed font-light min-h-[60px] max-w-xs mx-auto">
            {product.description}
          </p>

          <div className="mb-8 flex-grow w-full">
            <ul className="space-y-3 flex flex-col items-center">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                  {/* Premium Dot Indicator */}
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3 shadow-[0_0_8px_rgba(var(--primary-500),0.6)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="mt-auto pt-6 border-t border-white/5">
            <button className="w-full group/btn flex items-center justify-between text-white font-medium hover:text-primary-300 transition-colors">
              <span className="text-sm">{product.ctaText}</span>
              <span className="p-2 rounded-full bg-white/5 group-hover/btn:bg-primary-500/20 transition-colors">
                <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </span>
            </button>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
}
