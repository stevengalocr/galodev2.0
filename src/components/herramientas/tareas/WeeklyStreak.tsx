'use client';

import { WEEK_DAYS, TOOL_ACCENT } from '@/lib/tareas/constants';
import type { Habit, HabitLog } from '@/lib/tareas/types';

interface Props {
  habits: Habit[];
  weekLogs: Pick<HabitLog, 'logged_date'>[];
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  // Start from Monday of current week
  const day = today.getDay(); // 0=Sun, 1=Mon ...
  const diff = day === 0 ? -6 : 1 - day;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + diff + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function WeeklyStreak({ habits, weekLogs }: Props) {
  const weekDates = getWeekDates();
  const today = new Date().toISOString().slice(0, 10);
  const logsByDate = new Set(weekLogs.map((l) => l.logged_date));

  // A day is "complete" if all habits have a log for that day
  const totalHabits = habits.length;

  const isDayComplete = (date: string): boolean => {
    if (totalHabits === 0) return false;
    const logsForDay = weekLogs.filter((l) => l.logged_date === date).length;
    return logsForDay >= totalHabits;
  };

  const isFuture = (date: string): boolean => date > today;
  const isToday = (date: string): boolean => date === today;

  return (
    <div
      className="rounded-2xl p-4 mb-5"
      style={{
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.15)',
      }}
    >
      <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/30 mb-3">
        Esta semana
      </p>
      <div className="flex items-center justify-between">
        {weekDates.map((date, i) => {
          const complete = isDayComplete(date);
          const future = isFuture(date);
          const todayDay = isToday(date);

          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold text-white/30">
                {WEEK_DAYS[i]}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: complete
                    ? TOOL_ACCENT
                    : todayDay
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  border: todayDay && !complete
                    ? `2px solid rgba(16,185,129,0.4)`
                    : complete
                    ? 'none'
                    : '2px solid rgba(255,255,255,0.06)',
                  opacity: future ? 0.3 : 1,
                }}
              >
                {complete && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
