import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_HABITS } from '@/lib/tareas/constants';

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Auto-seed default habits if user has none
  const { data: existing, error: checkError } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  if (checkError) return NextResponse.json({ error: checkError.message }, { status: 500 });

  if (existing && existing.length === 0) {
    await supabase.from('habits').insert(
      DEFAULT_HABITS.map((h, i) => ({
        user_id: user.id,
        name: h.name,
        description: h.description,
        sort_order: i,
      }))
    );
  }

  // Fetch habits + today's logs
  const today = new Date().toISOString().slice(0, 10);

  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true });

  if (habitsError) return NextResponse.json({ error: habitsError.message }, { status: 500 });

  const { data: logs, error: logsError } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('logged_date', today);

  if (logsError) return NextResponse.json({ error: logsError.message }, { status: 500 });

  // Fetch last 7 days of logs for streak calculation
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const from = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: weekLogs, error: weekError } = await supabase
    .from('habit_logs')
    .select('logged_date')
    .eq('user_id', user.id)
    .gte('logged_date', from)
    .lte('logged_date', today);

  if (weekError) return NextResponse.json({ error: weekError.message }, { status: 500 });

  return NextResponse.json({ data: { habits, todayLogs: logs, weekLogs } });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, description, icon } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('habits')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = existing ? existing.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() ?? null,
      icon: icon ?? null,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
