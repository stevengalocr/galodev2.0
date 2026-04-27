'use client';

import { Flame, Star } from 'lucide-react';
import { TOOL_ACCENT } from '@/lib/tareas/constants';
import type { Task, Habit, HabitLog } from '@/lib/tareas/types';

interface Props {
  tasks: Task[];
  habits: Habit[];
  todayLogs: HabitLog[];
  weekLogs: Pick<HabitLog, 'logged_date'>[];
}

function calcStreak(habits: Habit[], logs: Pick<HabitLog, 'logged_date'>[]): number {
  if (habits.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const logsForDay = logs.filter((l) => l.logged_date === dateStr).length;
    if (logsForDay >= habits.length) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function StatCard({
  label,
  done,
  total,
}: {
  label: string;
  done: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = pct === 100 && total > 0;
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: complete ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.025)',
        border: complete ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="flex items-end justify-between mb-3">
        <p className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {label}
        </p>
        <span
          className="text-[22px] font-bold tabular-nums leading-none"
          style={{ color: complete ? TOOL_ACCENT : 'rgba(255,255,255,0.8)' }}
        >
          {done}/{total}
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: complete
              ? `linear-gradient(90deg, ${TOOL_ACCENT}, #34d399)`
              : 'rgba(255,255,255,0.18)',
          }}
        />
      </div>
      <p className="text-[10px] mt-2 tabular-nums" style={{ color: 'rgba(255,255,255,0.22)' }}>
        {pct}% completado
      </p>
    </div>
  );
}

export default function Dashboard({ tasks, habits, todayLogs, weekLogs }: Props) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const completedTasks = tasks.filter((t) => t.completed).length;
  const completedHabits = todayLogs.length;
  const streak = calcStreak(habits, weekLogs);

  const allDone =
    tasks.length > 0 && habits.length > 0 &&
    completedTasks === tasks.length && completedHabits === habits.length;

  return (
    <div className="space-y-4">
      {/* Date */}
      <div className="pt-1 pb-2">
        <p className="text-[11px] font-semibold capitalize" style={{ color: 'rgba(255,255,255,0.28)' }}>
          {dateLabel}
        </p>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div
          className="rounded-2xl px-5 py-5 flex items-center justify-between"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.13em] uppercase mb-1" style={{ color: 'rgba(16,185,129,0.6)' }}>
              Racha activa
            </p>
            <p className="text-[36px] font-bold leading-none" style={{ color: TOOL_ACCENT }}>
              {streak}
              <span className="text-[14px] font-medium ml-1.5" style={{ color: 'rgba(16,185,129,0.6)' }}>
                {streak === 1 ? 'dia' : 'dias'}
              </span>
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <Flame size={22} style={{ color: TOOL_ACCENT }} />
          </div>
        </div>
      )}

      <StatCard label="Tareas de hoy" done={completedTasks} total={tasks.length} />
      <StatCard label="Habitos de hoy" done={completedHabits} total={habits.length} />

      {allDone && (
        <div
          className="rounded-2xl px-5 py-5 flex items-center gap-4"
          style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.18)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.15)' }}
          >
            <Star size={18} style={{ color: TOOL_ACCENT }} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white">Todo completado</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Excelente dia de trabajo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
