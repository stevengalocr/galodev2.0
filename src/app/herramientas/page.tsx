import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/herramientas/LogoutButton';
import ToolsGrid from '@/components/herramientas/ToolsGrid';
import { Wrench, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Herramientas | GaloDev',
};

export default async function HerramientasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/herramientas/login');

  const userEmail = user.email ?? '';
  const displayName = userEmail.split('@')[0];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
    >
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,111,217,0.07) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 30% at 90% 60%, rgba(124,59,217,0.05) 0%, transparent 60%)',
          ].join(','),
        }}
      />

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8"
        style={{
          height: '68px',
          background: 'rgba(8,11,24,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-white font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            GaloDev
          </Link>
          <span className="text-white/20 text-sm">/</span>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Wrench size={13} />
            <span>Herramientas</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-white/25">{userEmail}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} style={{ color: 'var(--color-primary-400, #5089ff)' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30">
              Panel Privado
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Hola, {displayName} 👋
          </h1>
          <p className="text-white/35 text-base">Tus herramientas internas de GaloDev.</p>
        </div>

        <ToolsGrid />
      </main>
    </div>
  );
}
