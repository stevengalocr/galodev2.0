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
import { useRef, useState, useEffect } from 'react';
import { Product } from '@/data/products'; // Keep interface

export default function ProductsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const t = useTranslations();

  // Handle window resize for responsive 3D layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      image: '/products/allinone_min.png',
      ctaText: 'Ver más',
      shortTitle: t.products.allinone.short,
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

        {/* 3D Coverflow Container */}
        <div
          className="relative w-full h-[500px] flex justify-center items-center my-8 md:my-16"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {products.map((product, index) => {
            const offset = index - activeProductIndex;
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // Visual configuration
            const xOffset = 450; // Increased spacing for wider distribution
            const zOffset = -200; // depth spacing
            const rotateAngle = 30; // rotation angle in degrees

            // Calculate specific 3D properties
            let translateX = offset * xOffset;
            let translateZ = absOffset * zOffset;
            let rotateY = 0;

            if (offset < 0) {
              rotateY = rotateAngle; // Left items face right
            } else if (offset > 0) {
              rotateY = -rotateAngle; // Right items face left
            }

            const scale = isActive ? 1.1 : Math.max(0.8, 1 - absOffset * 0.1);
            const opacity = isActive ? 1 : Math.max(0.4, 1 - absOffset * 0.3);
            const zIndex = 100 - absOffset;

            // Only render visibly adjacent items (show 3 total: active + 1 on each side)
            if (absOffset > 1) return null;

            return (
              <motion.div
                key={product.id}
                initial={false}
                animate={{
                  x: translateX,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                }}
                style={{
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  top: '50%',
                  left: '50%',
                  marginLeft: isMobile ? -150 : -200, // Half width center fix
                  marginTop: isMobile ? -225 : -200, // Approx height center fix
                  width: isMobile ? 300 : 400,
                  cursor: isActive ? 'default' : 'pointer',
                  // Reflection Effect
                  WebkitBoxReflect: isActive
                    ? 'below 0px linear-gradient(transparent, transparent 70%, rgba(0,0,0,0.3))'
                    : undefined,
                }}
                onClick={() => scrollToProduct(index)}
              >
                <div
                  className={`relative w-full h-full transition-all duration-300 ${isActive ? 'brightness-110 drop-shadow-2xl' : 'grayscale-[0.5] hover:grayscale-0'}`}
                >
                  {/* Glass overlay for inactive items to signify depth */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/40 z-50 rounded-3xl pointer-events-none transition-opacity duration-300" />
                  )}
                  <ProductCard product={product} index={index} />
                </div>
              </motion.div>
            );
          })}
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
