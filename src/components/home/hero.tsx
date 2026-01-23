'use client';

import Image from 'next/image';
import { useLanguage } from '@/providers/language.provider';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section 
      className="relative flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 md:px-8"
      style={{ marginBottom: '6.5vh' }}
    >
      {/* Bitmoji Avatar */}
      <div className="relative w-[555px] sm:w-[777px] md:w-[888px] lg:w-[999px] xl:w-[1111px]">
        <Image 
          src="/images/hero-bitmoji.png" 
          alt="GaloDev Avatar"
          width={1200}
          height={1200}
          priority
          className="w-full h-auto object-contain drop-shadow-[0_0_60px_rgba(59,111,217,0.3)]"
        />
      </div>

      {/* Text Content - With proper horizontal padding */}
      <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-20 xl:-mt-28 z-10 pb-[10vh] lg:pb-[5vh] px-5 sm:px-8 md:px-12">
        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          {t.home.hero.name}
        </h1>

        {/* Role */}
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 tracking-wide">
          {t.home.hero.role}
        </h2>

        {/* Description */}
        <p className="max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl text-xs sm:text-sm md:text-base lg:text-lg text-white/70 font-light leading-relaxed">
          {t.home.hero.description}
        </p>
      </div>
    </section>
  );
}
