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
      <div className="relative w-full max-w-[680px] sm:max-w-[777px] md:max-w-[888px] lg:max-w-[999px] xl:max-w-[1111px] scale-[1.7] sm:scale-100 origin-bottom">
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
        {/* Brand Name */}
        <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          {t.home.hero.name}
        </h1>

        {/* Role */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 tracking-wide">
          {t.home.hero.role}
        </h2>

        {/* Description */}
        <p className="max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl text-base sm:text-lg text-white/70 font-light leading-relaxed">
          {t.home.hero.description}
        </p>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { DiMsqlServer } from 'react-icons/di';
import {
  FaAngular,
  FaCss3Alt,
  FaDocker, FaGitAlt,
  FaHtml5,
  FaReact
} from 'react-icons/fa';
import {
  SiDotnet,
  SiGo,
  SiNextdotjs,
  SiPostgresql,
  SiPostman,
  SiTypescript
} from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';

const icons = [
  // --- The Cloud / Galaxy (Maximized Vertical Spread) ---
  // Filling the upper "Red Zone" completely
  // Higher negative Y values to push further up into empty space
  
  // Tier 1: The Apex (Mobile: Higher spread | Desktop: Lowered)
  { Icon: SiNextdotjs, color: '#ffffff', delay: 0.6, x: 0, y: -70, mobileY: -105 },
  { Icon: FaReact, color: '#61DAFB', delay: 0.1, x: -12, y: -100, mobileY: -150 },
  { Icon: SiTypescript, color: '#3178C6', delay: 0.2, x: 12, y: -100, mobileY: -150 },

  // Tier 2: Upper Mid
  { Icon: FaHtml5, color: '#E34F26', delay: 0.4, x: -28, y: -80, mobileY: -120 },
  { Icon: FaCss3Alt, color: '#1572B6', delay: 0.7, x: -20, y: -45, mobileY: -80 },
  { Icon: TbBrandCSharp, color: '#AA00FF', delay: 0, x: 0, y: -110, mobileY: -170 },

  // Tier 3: Lower Mid
  { Icon: SiDotnet, color: '#512BD4', delay: 0.5, x: 28, y: -80, mobileY: -120 },
  { Icon: FaAngular, color: '#DD0031', delay: 0.8, x: 20, y: -45, mobileY: -80 },
  { Icon: FaDocker, color: '#2496ED', delay: 1.0, x: -38, y: -40, mobileY: -85 },
  { Icon: SiGo, color: '#00ADD8', delay: 1.2, x: 38, y: -40, mobileY: -85 },

  // Tier 4: Base
  { Icon: SiPostgresql, color: '#336791', delay: 1.4, x: -12, y: 10, mobileY: -40 },
  { Icon: DiMsqlServer, color: '#CC2927', delay: 1.5, x: 12, y: 10, mobileY: -40 },
  { Icon: SiPostman, color: '#FF6C37', delay: 1.6, x: -30, y: -10, mobileY: -45 },
  { Icon: FaGitAlt, color: '#F05032', delay: 1.8, x: 30, y: -10, mobileY: -45 },
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

function FloatingIcon({ Icon, color, delay, x, y, mobileY }: { Icon: any, color: string, delay: number, x: number, y: number, mobileY: number }) {
  return (
    <motion.div
      className="absolute flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 md:w-[66px] md:h-[66px] lg:w-16 lg:h-16 bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-white/5 top-[var(--mobile-top)] lg:top-[var(--desktop-top)]"
      style={{
        left: `${50 + x}%`,
        '--mobile-top': `${45 + mobileY}%`,
        '--desktop-top': `${45 + y}%`,
        transform: 'translate(-50%, -50%)',
      } as any}
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
          ease: "easeInOut",
          delay: delay
        }
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-40" />
      <Icon className="relative z-10 text-xl sm:text-xl md:text-4xl lg:text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" style={{ color }} />
      <div 
        className="absolute inset-0 rounded-2xl opacity-25 blur-lg transition-colors duration-300"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
