import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HerramientasHub from './HerramientasHub';

export default async function HerramientasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/herramientas/login');

  return <HerramientasHub />;
}
