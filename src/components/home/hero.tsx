'use client';

import { useLanguage } from '@/providers/language.provider';

export function Hero() {
  const { t } = useLanguage();

  return (
    <div className="relative flex flex-col items-center w-full max-w-7xl px-4 mt-[2vh]">
      {/* Bitmoji Image */}
      <div className="relative w-[750px] sm:w-[850px] md:w-[1000px] xl:w-[1100px] h-auto z-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/images/hero-bitmoji.png" 
          alt="Steven Galo" 
          className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(59,111,217,0.25)]"
        />
      </div>

      {/* Text Content - Below Bitmoji */}
      <div className="flex flex-col items-center text-center space-y-3 z-10">
        {/* Name - Big & Bold */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          {t.home.hero.name}
        </h1>

        {/* Role - Gradient or Accent Color */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 tracking-wide">
          {t.home.hero.role}
        </h2>

        {/* Description - Subtle */}
        <p className="max-w-xl text-base sm:text-lg text-white/70 font-light mt-2 leading-relaxed">
          {t.home.hero.description}
        </p>

      </div>
    </div>
  );
}
