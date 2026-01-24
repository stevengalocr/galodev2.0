import HeroSection from '@/components/entrepreneurs/HeroSection';
import ValueProposition from '@/components/entrepreneurs/ValueProposition';
import ProductsGrid from '@/components/entrepreneurs/ProductsGrid';
import CTASection from '@/components/entrepreneurs/CTASection';

export const metadata = {
  title: 'Soluciones para Emprendedores | GaloDev',
  description:
    'Software a medida para emprendedores que quieren vender más y automatizar su negocio.',
};

export default function EntrepreneursPage() {
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
