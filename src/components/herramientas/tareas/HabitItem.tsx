'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { TOOL_ACCENT } from '@/lib/tareas/constants';
import type { Habit } from '@/lib/tareas/types';

interface Props {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (habitId: string, completed: boolean) => Promise<void>;
  onDelete: (habitId: string) => void;
}

function HabitAvatar({ name, isCompleted }: { name: string; isCompleted: boolean }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
      style={{
        background: isCompleted ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.06)',
        border: isCompleted ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.2s ease',
      }}
    >
      <span
        className="text-[11px] font-bold"
        style={{ color: isCompleted ? '#6ee7b7' : 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}
      >
        {initials}
      </span>
    </div>
  );
}

export default function HabitItem({ habit, isCompleted, onToggle, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onToggle(habit.id, !isCompleted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-3.5 group mb-2"
      style={{
        background: isCompleted ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.025)',
        border: isCompleted
          ? '1px solid rgba(16,185,129,0.18)'
          : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.2s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <HabitAvatar name={habit.name} isCompleted={isCompleted} />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-medium truncate"
          style={{
            color: isCompleted ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            textDecorationColor: 'rgba(255,255,255,0.2)',
          }}
        >
          {habit.name}
        </p>
        {habit.description && (
          <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {habit.description}
          </p>
        )}
      </div>

      {/* Delete — visible on hover/active */}
      <button
        onClick={() => onDelete(habit.id)}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-150 mr-1"
        style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.18)',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Eliminar hábito"
      >
        <Trash2 size={12} style={{ color: 'rgba(239,68,68,0.6)' }} />
      </button>

      {/* Toggle */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex-shrink-0 w-11 h-6 rounded-full relative transition-all duration-300 disabled:opacity-50"
        style={{
          background: isCompleted ? TOOL_ACCENT : 'rgba(255,255,255,0.08)',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label={isCompleted ? 'Desmarcar' : 'Marcar como completado'}
      >
        <motion.div
          layout
          className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm"
          style={{ left: isCompleted ? 'calc(100% - 21px)' : '3px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
        />
      </button>
    </div>
  );
}
