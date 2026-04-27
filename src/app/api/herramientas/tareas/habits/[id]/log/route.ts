import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('habit_logs')
    .insert({ habit_id: id, user_id: user.id, logged_date: today })
    .select()
    .single();

  if (error) {
    // Unique constraint violation = already logged → treat as success
    if (error.code === '23505') {
      return NextResponse.json({ data: null, alreadyLogged: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', id)
    .eq('user_id', user.id)
    .eq('logged_date', today);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
