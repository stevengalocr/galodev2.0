import { Header } from '@/components/layout/header';
import { Hero } from '@/components/home/hero';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Space Background Layer */}
      <div className="bg-space absolute inset-0" />
      
      {/* Content Layer */}
      <div className="relative z-20 min-h-screen flex flex-col">
        <Header />
        
        {/* Main Content Area - Hero
        */}
        <main
          style={{ marginBottom: '10vh' }}
          className="flex-1 flex flex-col items-center justify-end relative">
          <Hero />
        </main>
      </div>
    </div>
  );
}
