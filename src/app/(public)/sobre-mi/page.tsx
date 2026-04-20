import PortfolioSection from '@/components/portfolio/PortfolioSection';

export const metadata = {
  title: 'Sobre Mí | GaloDev',
  description: 'Conoce a Steven Galo — Ingeniero Full Stack con experiencia en React, Go, C# y más.',
};

export default function SobreMiPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>
      <div className="relative z-10">
        {/* Spacer that accounts for fixed header at top-[5%] + header height */}
        <div className="h-36 sm:h-44" />
        <PortfolioSection />
      </div>
    </div>
  );
}
