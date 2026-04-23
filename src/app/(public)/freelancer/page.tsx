import HeroSection from '@/components/entrepreneurs/HeroSection';
import ValueProposition from '@/components/entrepreneurs/ValueProposition';
import ProductsGrid from '@/components/entrepreneurs/ProductsGrid';
import CTASection from '@/components/entrepreneurs/CTASection';

export const metadata = {
  title: 'Freelancer Full-Stack | Proyectos Web, APIs, Sistemas | GaloDev',
  description:
    'Freelancer disponible para proyectos. He trabajado en landing pages, e-commerce, APIs REST, sistemas completos y más. Stack: Next.js, React, Go, TypeScript.',
};

export default function FreelancerPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-space" />
      </div>

      <HeroSection />

      <div id="products" className="relative z-10">
        <ProductsGrid />
      </div>

      <div className="relative z-10">
        <CTASection />
      </div>
    </main>
  );
}
