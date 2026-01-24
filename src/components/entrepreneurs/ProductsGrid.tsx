'use client';

import { useTranslations } from '@/providers/language.provider';
import {
  FiLayout,
  FiShoppingBag,
  FiMessageSquare,
  FiTrendingUp,
  FiBriefcase,
} from 'react-icons/fi';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Product } from '@/data/products'; // Keep interface

export default function ProductsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const t = useTranslations();

  // Dynamic products array based on current language
  const products: Product[] = [
    {
      id: 'landing-page',
      title: t.products.landing.title,
      description: t.products.landing.desc,
      targetAudience: t.products.landing.audience,
      mainBenefit: 'Conversion', // Helper internal
      icon: FiLayout,
      features: [
        t.products.landing.features['0'],
        t.products.landing.features['1'],
        t.products.landing.features['2'],
        t.products.landing.features['3'],
      ],
      image: '/products/landing_brand.png',
      ctaText: 'Ver más',
      shortTitle: t.products.landing.short,
      imageScale: 1.5,
    },
    {
      id: 'ecommerce',
      title: t.products.ecommerce.title,
      description: t.products.ecommerce.desc,
      targetAudience: t.products.ecommerce.audience,
      mainBenefit: 'Sales',
      icon: FiShoppingBag,
      features: [
        t.products.ecommerce.features['0'],
        t.products.ecommerce.features['1'],
        t.products.ecommerce.features['2'],
        t.products.ecommerce.features['3'],
      ],
      image: '/products/ecommerce_min.png',
      ctaText: 'Ver más',
      shortTitle: t.products.ecommerce.short,
    },
    {
      id: 'chatbot-ai',
      title: t.products.chatbot.title,
      description: t.products.chatbot.desc,
      targetAudience: t.products.chatbot.audience,
      mainBenefit: 'Automation',
      icon: FiMessageSquare,
      features: [
        t.products.chatbot.features['0'],
        t.products.chatbot.features['1'],
        t.products.chatbot.features['2'],
        t.products.chatbot.features['3'],
      ],
      image: '/products/chatbot_brand.png',
      ctaText: 'Ver más',
      shortTitle: t.products.chatbot.short,
      imageScale: 1.3,
    },
    {
      id: 'mini-crm',
      title: t.products.crm.title,
      description: t.products.crm.desc,
      targetAudience: t.products.crm.audience,
      mainBenefit: 'Management',
      icon: FiTrendingUp,
      features: [
        t.products.crm.features['0'],
        t.products.crm.features['1'],
        t.products.crm.features['2'],
        t.products.crm.features['3'],
      ],
      image: '/products/crm_min.png',
      ctaText: 'Ver más',
      shortTitle: t.products.crm.short,
    },
    {
      id: 'all-in-one',
      title: t.products.allinone.title,
      description: t.products.allinone.desc,
      targetAudience: t.products.allinone.audience,
      mainBenefit: 'Growth',
      icon: FiBriefcase,
      features: [
        t.products.allinone.features['0'],
        t.products.allinone.features['1'],
        t.products.allinone.features['2'],
        t.products.allinone.features['3'],
        t.products.allinone.features['4'],
      ],
      image: '/products/allinone_min.jpg',
      ctaText: 'Ver más',
      shortTitle: t.products.allinone.short,
    },
  ];

  const scrollToProduct = (index: number) => {
    setActiveProductIndex(index);
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 300 : 400; // Match card width + gap approximation
      const gap = window.innerWidth < 768 ? 24 : 32;
      const scrollPos = index * (cardWidth + gap);

      containerRef.current.scrollTo({
        left: scrollPos,
        behavior: 'smooth',
      });
    }
  };

  // Optional: Update active state on scroll (simple implementation)
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const cardWidth = window.innerWidth < 768 ? 324 : 432; // Width + gap
      const index = Math.round(scrollLeft / cardWidth);
      if (index !== activeProductIndex && index >= 0 && index < products.length) {
        setActiveProductIndex(index);
      }
    }
  };

  return (
    <section id="products" className="py-24 relative bg-background overflow-hidden">
      {/* Intro Section - Integrated here as requested */}
      <div className="w-full px-4 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            <span className="text-primary-300">{t.products.sectionTitle}</span>
          </h2>
        </motion.div>
      </div>

      <div>
        <div
          style={{
            marginBottom: '.5rem',
          }}
          className="text-center mb-8 px-4 w-full flex flex-col items-center"
        >
          <p className="text-lg text-gray-400 w-11/12 max-w-2xl mx-auto leading-relaxed">
            {t.products.swipeHint}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto snap-x snap-mandatory pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-6 md:gap-8 px-8 md:px-12 w-max">
            {products.map((product, index) => (
              <div key={product.id} className="w-[300px] md:w-[400px] flex-shrink-0 snap-center">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dock - Header Style */}
        <div className="mt-12 px-4 flex justify-center">
          <div
            className="flex flex-wrap justify-center gap-2"
            style={{
              borderRadius: '1.5rem',
              padding: '0.5rem 0.5rem',
              background: 'rgba(10, 10, 20, 0.2)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              width: 'fit-content',
            }}
          >
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => scrollToProduct(index)}
                className={`
                            relative px-4 py-2 text-sm transition-all duration-300 whitespace-nowrap
                            ${
                              activeProductIndex === index
                                ? 'text-white font-medium shadow-sm bg-primary-500/20'
                                : 'text-white/60 font-light hover:text-white hover:bg-white/5'
                            }
                        `}
                style={{
                  padding: '0.5rem 0.5rem',
                  borderRadius: '1.5rem',
                  border:
                    activeProductIndex === index
                      ? '0.5px solid rgba(255, 255, 255, 0.1)'
                      : '0.5px solid transparent',
                }}
              >
                {/* Brackets Effect for Active Item (Subtle) */}
                {activeProductIndex === index && (
                  <motion.div
                    layoutId="activebracket"
                    className="absolute inset-0 flex justify-between items-center pointer-events-none px-2"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  ></motion.div>
                )}
                <span className="relative z-10 px-2">{product.shortTitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
