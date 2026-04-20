'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/herramientas/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-white/5"
    >
      <LogOut size={16} />
      <span>Salir</span>
    </button>
  );
}
