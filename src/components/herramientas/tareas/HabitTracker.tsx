'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HabitItem from './HabitItem';
import WeeklyStreak from './WeeklyStreak';
import { TOOL_ACCENT } from '@/lib/tareas/constants';
import type { Habit, HabitLog } from '@/lib/tareas/types';

interface Props {
  habits: Habit[];
  todayLogs: HabitLog[];
  weekLogs: Pick<HabitLog, 'logged_date'>[];
  onToggleHabit: (habitId: string, completed: boolean) => Promise<void>;
  onDeleteHabit: (habitId: string) => void;
  onAddHabit: (name: string) => Promise<void>;
}

export default function HabitTracker({
  habits,
  todayLogs,
  weekLogs,
  onToggleHabit,
  onDeleteHabit,
  onAddHabit,
}: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const completedIds = new Set(todayLogs.map((l) => l.habit_id));
  const completedCount = habits.filter((h) => completedIds.has(h.id)).length;

  const handleAdd = async () => {
    if (!newName.trim() || adding) return;
    setAdding(true);
    try {
      await onAddHabit(newName.trim());
      setNewName('');
      setShowAdd(false);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <WeeklyStreak habits={habits} weekLogs={weekLogs} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10.5px] font-bold tracking-[0.14em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Habitos de hoy
        </p>
        <span
          className="text-[12px] font-bold tabular-nums"
          style={{
            color: completedCount === habits.length && habits.length > 0
              ? TOOL_ACCENT
              : 'rgba(255,255,255,0.3)',
          }}
        >
          {completedCount}/{habits.length}
        </span>
      </div>

      {/* Habit list */}
      <AnimatePresence mode="popLayout">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HabitItem
              habit={habit}
              isCompleted={completedIds.has(habit.id)}
              onToggle={onToggleHabit}
              onDelete={onDeleteHabit}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {habits.length === 0 && !showAdd && (
        <div className="text-center py-10">
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Agrega tu primer habito
          </p>
        </div>
      )}

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl p-4 mb-3 mt-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(16,185,129,0.22)',
              }}
            >
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del habito..."
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full bg-transparent text-white text-[14px] placeholder:text-white/22 outline-none mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim() || adding}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-35 transition-all"
                  style={{ background: TOOL_ACCENT }}
                >
                  {adding ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Agregar'}
                </button>
                <button
                  onClick={() => { setShowAdd(false); setNewName(''); }}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium mt-2 transition-all"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px dashed rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.3)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Plus size={14} />
          Agregar habito
        </button>
      )}
    </div>
  );
}
