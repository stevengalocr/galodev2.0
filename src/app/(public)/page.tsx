/**
 * Home Page
 * 
 * Landing page with cosmic space background and smooth gradient fades.
 */

import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base Color Layer - Deep space blue, not pure black */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'hsl(240, 30%, 6%)' }}
      />
      
      {/* Space Background Layer */}
      <div className="bg-space absolute inset-0" />
      
      {/* Top Gradient Fade - Smooth blend with deep blue */}
      <div 
        className="absolute top-0 left-0 right-0 h-[15vh] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            hsla(230, 40%, 8%, 1) 0%,
            hsla(230, 40%, 8%, 0.8) 30%,
            hsla(230, 40%, 8%, 0.4) 60%,
            hsla(230, 40%, 8%, 0) 100%
          )`
        }}
      />
      
      {/* Bottom Gradient Fade - Smooth blend with deep blue */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[15vh] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            hsla(230, 40%, 8%, 1) 0%,
            hsla(230, 40%, 8%, 0.8) 30%,
            hsla(230, 40%, 8%, 0.4) 60%,
            hsla(230, 40%, 8%, 0) 100%
          )`
        }}
      />

      {/* Left Edge Fade - Subtle side blend */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-[10vw] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            to right,
            hsla(230, 40%, 8%, 0.6) 0%,
            hsla(230, 40%, 8%, 0) 100%
          )`
        }}
      />

      {/* Right Edge Fade - Subtle side blend */}
      <div 
        className="absolute top-0 bottom-0 right-0 w-[10vw] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            to left,
            hsla(230, 40%, 8%, 0.6) 0%,
            hsla(230, 40%, 8%, 0) 100%
          )`
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-20 min-h-screen">
        <Header />
        
        {/* Main Content Area */}
        <main className="pt-24">
          {/* Hero content will go here */}
        </main>
      </div>
    </div>
  );
}
