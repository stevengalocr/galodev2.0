import { Hero } from '@/components/home/hero';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Space Background Layer */}
      <div className="bg-space" />
      
      {/* Edge Fade Overlays for seamless visual continuity */}
      <div className="fade-top" />
      <div className="fade-bottom" />
      
      {/* Content Layer */}
      <div className="relative z-20 h-screen flex flex-col">
        
        {/* Main Content Area - Hero positioned from bottom 8vh */}
        <main className="flex-1 flex flex-col items-center justify-end">
          <Hero />
        </main>
      </div>
    </div>
  );
}
