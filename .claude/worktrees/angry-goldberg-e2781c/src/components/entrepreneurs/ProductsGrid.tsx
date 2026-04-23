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
import { useRef, useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';

const AUTO_INTERVAL = 3800; // ms between auto-advances on desktop

export default function ProductsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const products: Product[] = [
    {
      id: 'landing-page',
      title: t.products.landing.title,
      description: t.products.landing.desc,
      targetAudience: t.products.landing.audience,
      mainBenefit: 'Conversion',
      icon: FiLayout,
      features: [
        t.products.landing.features['0'],
        t.products.landing.features['1'],
        t.products.landing.features['2'],
        t.products.landing.features['3'],
      ],
      image: '/products/landing_brand.png',
      ctaText: t.products.landing.short,
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
      ctaText: t.products.ecommerce.short,
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
      ctaText: t.products.allinone.short,
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
      ctaText: t.products.crm.short,
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
      ctaText: t.products.chatbot.short,
      shortTitle: t.products.chatbot.short,
      imageScale: 1.3,
    },
  ];

  // Navigate to a product (works for both mobile snap and desktop 3D)
  const scrollToProduct = useCallback(
    (index: number) => {
      setActiveProductIndex(index);
      if (isMobile && cardRefs.current[index]) {
        cardRefs.current[index]!.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    },
    [isMobile]
  );

  // Auto-advance carousel on desktop
  useEffect(() => {
    if (isMobile || isHovered) return;
    const interval = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % products.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(interval);
  }, [isMobile, isHovered, products.length]);

  // Track active card on mobile scroll
  const handleMobileScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    const center = scrollLeft + clientWidth / 2;
    let minDist = Infinity;
    let closest = 0;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    if (closest !== activeProductIndex) setActiveProductIndex(closest);
  };

  return (
    <section id="products" className="py-24 relative bg-background overflow-hidden">
      {/* Intro Section */}
      <div className="w-full px-4 mb-16 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto text-center flex flex-col items-center"
        >
          <span
            style={{ padding: '10px', marginTop: '1.5rem', marginBottom: '2.5rem' }}
            className="inline-flex items-center justify-center px-10 py-4 mb-10 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-bold backdrop-blur-sm tracking-[0.2em] shadow-lg shadow-primary-500/10 uppercase"
          >
            {t.entrepreneurs.hero.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            <span className="text-primary-300">{t.products.sectionTitle}</span>
          </h2>
        </motion.div>
      </div>

      <div>
        <div
          style={{ marginBottom: '.5rem' }}
          className="text-center mb-8 px-4 w-full flex flex-col items-center"
        >
          <p className="text-lg text-gray-400 w-11/12 max-w-2xl mx-auto leading-relaxed">
            {t.products.swipeHint}
          </p>
        </div>

        {/* ── MOBILE: Horizontal Snap Scroll Carousel ── */}
        {isMobile && (
          <div className="w-full relative">
            {/* Left / right edge fade for peek effect */}
            <div className="absolute left-0 top-0 bottom-6 w-10 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-6 w-10 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
              ref={containerRef}
              onScroll={handleMobileScroll}
              className="flex pb-6"
              style={{
                overflowX: 'scroll',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                gap: '12px',
                paddingLeft: 'calc(50vw - 150px)',
                paddingRight: 'calc(50vw - 150px)',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {products.map((product, index) => {
                const isActive = index === activeProductIndex;
                return (
                  <motion.div
                    key={product.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    animate={{
                      scale: isActive ? 1 : 0.91,
                      opacity: isActive ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{
                      scrollSnapAlign: 'center',
                      flexShrink: 0,
                      width: '300px',
                    }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DESKTOP: 3D Coverflow with Auto-Advance ── */}
        {!isMobile && (
          <div
            className="relative w-full h-[500px] flex justify-center items-center my-8 md:my-16"
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {products.map((product, index) => {
              const offset = index - activeProductIndex;
              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              const xOffset = 450;
              const zOffset = -200;
              const rotateAngle = 30;

              const translateX = offset * xOffset;
              const translateZ = absOffset * zOffset;
              const rotateY = offset < 0 ? rotateAngle : offset > 0 ? -rotateAngle : 0;
              const scale = isActive ? 1.1 : Math.max(0.8, 1 - absOffset * 0.1);
              const opacity = isActive ? 1 : Math.max(0.4, 1 - absOffset * 0.3);
              const zIndex = 100 - absOffset;

              if (absOffset > 1) return null;

              return (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={{
                    x: translateX,
                    z: translateZ,
                    rotateY,
                    scale,
                    opacity,
                    zIndex,
                  }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 150, damping: 20 }}
                  style={{
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    top: '50%',
                    left: '50%',
                    marginLeft: -200,
                    marginTop: -200,
                    width: 400,
                    cursor: isActive ? 'default' : 'pointer',
                    WebkitBoxReflect: isActive
                      ? 'below 0px linear-gradient(transparent, transparent 70%, rgba(0,0,0,0.3))'
                      : undefined,
                  }}
                  onClick={() => !isActive && scrollToProduct(index)}
                >
                  <div
                    className={`relative w-full h-full transition-all duration-300 ${isActive ? 'brightness-110 drop-shadow-2xl' : 'grayscale-[0.5] hover:grayscale-0'}`}
                  >
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/40 z-50 rounded-3xl pointer-events-none transition-opacity duration-300" />
                    )}
                    <ProductCard product={product} index={index} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Navigation Dock (shared, both layouts) ── */}
        <div className="mt-8 md:mt-12 px-4 flex justify-center">
          <div
            className="flex flex-wrap justify-center gap-2"
            style={{
              borderRadius: '1.5rem',
              padding: '0.5rem',
              background: 'rgba(10, 10, 20, 0.2)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              width: 'fit-content',
            }}
          >
            {products.map((product, index) => {
              const isActive = activeProductIndex === index;
              return (
                <button
                  key={product.id}
                  onClick={() => scrollToProduct(index)}
                  className={`relative px-4 py-2 text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isActive
                      ? 'text-white font-medium shadow-sm bg-primary-500/20'
                      : 'text-white/60 font-light hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    padding: '0.5rem 0.5rem',
                    borderRadius: '1.5rem',
                    border: isActive
                      ? '0.5px solid rgba(255, 255, 255, 0.1)'
                      : '0.5px solid transparent',
                  }}
                >
                  {/* Auto-advance progress bar (desktop only, pauses on hover) */}
                  {isActive && !isMobile && !isHovered && (
                    <motion.span
                      key={`progress-${activeProductIndex}`}
                      className="absolute bottom-0 left-0 h-[2px] bg-blue-400/70 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activebracket"
                      className="absolute inset-0 flex justify-between items-center pointer-events-none px-2"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 px-2">{product.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
