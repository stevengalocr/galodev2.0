'use client';

import type { Task } from '@/lib/tareas/types';
import { TOOL_ACCENT } from '@/lib/tareas/constants';

interface Props {
  tasks: Task[];
}

export default function DayStats({ tasks }: Props) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4">
          <div className="text-center">
            <span className="block text-[22px] font-bold text-white leading-none">{completed}</span>
            <span className="text-[10px] text-white/40 mt-0.5 block">hechas</span>
          </div>
          <div className="text-center">
            <span className="block text-[22px] font-bold text-white/50 leading-none">{pending}</span>
            <span className="text-[10px] text-white/40 mt-0.5 block">pendientes</span>
          </div>
        </div>
        <span
          className="text-[28px] font-bold tabular-nums"
          style={{ color: TOOL_ACCENT }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${TOOL_ACCENT}, #34d399)`,
          }}
        />
      </div>
    </div>
  );
}
