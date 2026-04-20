import { Hero } from '@/components/home/hero';
import ProductsGrid from '@/components/entrepreneurs/ProductsGrid';
import CTASection from '@/components/entrepreneurs/CTASection';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      <div className="relative z-10 flex flex-col">
        <section className="relative min-h-screen flex flex-col items-center justify-end pb-20">
          <Hero />
        </section>

        <div
          id="entrepreneurs"
          className="relative z-20 bg-slate-950/30 backdrop-blur-sm border-t border-white/5"
        >
          <ProductsGrid />
          <CTASection />
        </div>
      </div>
    </div>
  );
}
