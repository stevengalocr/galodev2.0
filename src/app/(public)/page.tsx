import { Hero } from '@/components/home/hero';
import EntrepreneursHero from '@/components/entrepreneurs/HeroSection';
import ValueProposition from '@/components/entrepreneurs/ValueProposition';
import ProductsGrid from '@/components/entrepreneurs/ProductsGrid';
import CTASection from '@/components/entrepreneurs/CTASection';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Space Background Layer - Fixed to cover viewport during scroll */}
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      {/* Edge Fade Overlays - kept fixed to maintain the viewport effect or absolute to the first section? 
          Actually the original was absolute. If we scroll, these might look weird if fixed.
          Let's make them part of the first section wrapper.
      */}

      <div className="relative z-10 flex flex-col">
        {/* Main Home Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-end pb-20">
          <Hero />

          {/* Scroll Indicator Hint could go here if requested, but user removed it before. */}
        </section>

        {/* Entrepreneurs Section */}
        <div
          id="entrepreneurs"
          className="relative z-20 bg-slate-950/30 backdrop-blur-sm border-t border-white/5"
        >
          <EntrepreneursHero />
          <ValueProposition />
          <ProductsGrid />
          <CTASection />
        </div>
      </div>
    </div>
  );
}
