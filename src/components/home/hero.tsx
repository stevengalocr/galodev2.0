'use client';

import { useLanguage } from '@/providers/language.provider';
import Image from 'next/image';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="relative flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:pt-32"
      style={{ marginBottom: '6.5vh' }}
    >
      {/* Bitmoji Avatar */}
      <div className="relative z-10 w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] h-auto object-contain drop-shadow-2xl animate-fade-in-up origin-bottom">
        <TechFloatingIcons />
        <Image
          src="/images/hero-bitmoji.png"
          alt="GaloDev Avatar"
          width={1200}
          height={1200}
          priority
          className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_60px_rgba(59,111,217,0.3)]"
        />
      </div>

      {/* Text Content - With proper horizontal padding */}
      <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-20 xl:-mt-28 z-10 pb-[10vh] lg:pb-[5vh] px-5 sm:px-8 md:px-12">
        {/* Brand Name - Solid White, No Gradient */}
        <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md">
          {t.home.hero.name}
        </h1>

        {/* Role - Solid Accent Color, No Gradient */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-blue-400 tracking-wide drop-shadow-sm">
          {t.home.hero.role}
        </h2>

        {/* Description - Clean Text, No Glass Panel */}
        <p className="max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl text-base sm:text-lg text-gray-300 font-light leading-relaxed mt-2">
          {t.home.hero.description}
        </p>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { DiMsqlServer } from 'react-icons/di';
import { FaAngular, FaCss3Alt, FaDocker, FaGitAlt, FaHtml5, FaReact } from 'react-icons/fa';
import { SiDotnet, SiGo, SiNextdotjs, SiPostgresql, SiPostman, SiTypescript } from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';

const icons = [
  // --- The Galaxy Spread (Optimized for Visibility) ---
  // Adjusted to ensure no icons are lost off-screen on laptops/mobile
  // Max Spread limited to ~200% width relative to container to fit in 1200px layout

  // Far Outer Ring (The "Galaxy" Edges - safe range)
  { Icon: SiPostgresql, color: '#336791', delay: 0.6, x: -190, y: -100, mobileY: -90 }, // Far Left Top
  { Icon: TbBrandCSharp, color: '#AA00FF', delay: 0.2, x: 190, y: -100, mobileY: -90 }, // Far Right Top
  { Icon: FaGitAlt, color: '#F05032', delay: 1.6, x: -170, y: 10, mobileY: -20 }, // Far Left Bottom
  { Icon: SiPostman, color: '#FF6C37', delay: 1.8, x: 170, y: 10, mobileY: -20 }, // Far Right Bottom

  // Mid Ring (surrounding the core)
  { Icon: FaReact, color: '#61DAFB', delay: 1.0, x: -110, y: -140, mobileY: -130 }, // Mid Left High (Swapped from Low Left)
  { Icon: SiDotnet, color: '#512BD4', delay: 0.5, x: 110, y: -140, mobileY: -130 }, // Mid Right High
  { Icon: FaHtml5, color: '#E34F26', delay: 0.4, x: -100, y: -50, mobileY: -60 }, // Mid Left
  { Icon: SiGo, color: '#00ADD8', delay: 1.2, x: 100, y: -50, mobileY: -60 }, // Mid Right

  // Inner Ring (Closer to Bitmoji)
  { Icon: SiTypescript, color: '#3178C6', delay: 0, x: 0, y: -160, mobileY: -160 }, // Top Center (High but visible)
  { Icon: FaCss3Alt, color: '#1572B6', delay: 0.7, x: -60, y: -90, mobileY: -100 }, // Inner Left
  { Icon: FaDocker, color: '#2496ED', delay: 0.8, x: 60, y: -90, mobileY: -100 }, // Inner Right
  { Icon: FaAngular, color: '#DD0031', delay: 0.1, x: -45, y: -30, mobileY: -50 }, // Low Left cluster (Swapped from Mid Left High)
  { Icon: SiNextdotjs, color: '#d4d4d4ff', delay: 1.4, x: 45, y: -30, mobileY: -50 }, // Low Right cluster
  { Icon: DiMsqlServer, color: '#CC2927', delay: 1.5, x: 0, y: -110, mobileY: -120 }, // Center Mid
];

function TechFloatingIcons() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {icons.map((item, index) => (
        <FloatingIcon
          key={index}
          Icon={item.Icon}
          color={item.color}
          delay={item.delay}
          x={item.x}
          y={item.y}
          mobileY={item.mobileY}
        />
      ))}
    </div>
  );
}

function FloatingIcon({
  Icon,
  color,
  delay,
  x,
  y,
  mobileY,
}: {
  Icon: any;
  color: string;
  delay: number;
  x: number;
  y: number;
  mobileY: number;
}) {
  return (
    <motion.div
      className="absolute flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 md:w-[66px] md:h-[66px] lg:w-16 lg:h-16 backdrop-blur-[16px] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] top-[var(--mobile-top)] lg:top-[var(--desktop-top)]"
      style={
        {
          left: `${50 + x}%`,
          '--mobile-top': `${45 + mobileY}%`,
          '--desktop-top': `${45 + y}%`,
          transform: 'translate(-50%, -50%)',
          background:
            'linear-gradient(rgba(10, 10, 20, 0.2), rgba(10, 10, 20, 0.2)) padding-box, linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%) border-box',
          border: '1px solid transparent',
        } as any
      }
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 3 + Math.random(),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay,
        },
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-40 pointer-events-none" />
      <Icon
        className="relative z-10 text-xl sm:text-xl md:text-4xl lg:text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        style={{ color }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-25 blur-lg transition-colors duration-300 pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
