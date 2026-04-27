'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare, Flame, BarChart2, LogOut, ArrowLeft, Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

import TaskInput from '@/components/herramientas/tareas/TaskInput';
import TaskList from '@/components/herramientas/tareas/TaskList';
import DayStats from '@/components/herramientas/tareas/DayStats';
import FilterBar from '@/components/herramientas/tareas/FilterBar';
import HabitTracker from '@/components/herramientas/tareas/HabitTracker';
import Dashboard from '@/components/herramientas/tareas/Dashboard';

import type {
  Task, Habit, HabitLog, CreateTaskInput, ActiveFilter,
} from '@/lib/tareas/types';
import { TOOL_ACCENT } from '@/lib/tareas/constants';

type Tab = 'tareas' | 'habitos' | 'resumen';

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'tareas',  label: 'Tareas',   Icon: CheckSquare },
  { id: 'habitos', label: 'Hábitos',  Icon: Flame },
  { id: 'resumen', label: 'Resumen',  Icon: BarChart2 },
];

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Error desconocido');
  return json;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TareasPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('tareas');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [weekLogs, setWeekLogs] = useState<Pick<HabitLog, 'logged_date'>[]>([]);

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingHabits, setLoadingHabits] = useState(true);

  const [filter, setFilter] = useState<ActiveFilter>({ location: null, timeSlot: null });

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/herramientas/login');
    router.refresh();
  };

  // ── Fetch tasks ───────────────────────────────────────────────────────────

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await apiFetch<{ data: Task[] }>(
        `/api/herramientas/tareas/tasks?date=${today}`
      );
      setTasks(data);
    } catch {
      // silent — user sees empty list
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // ── Fetch habits ──────────────────────────────────────────────────────────

  const fetchHabits = useCallback(async () => {
    setLoadingHabits(true);
    try {
      const { data } = await apiFetch<{
        data: { habits: Habit[]; todayLogs: HabitLog[]; weekLogs: { logged_date: string }[] };
      }>('/api/herramientas/tareas/habits');
      setHabits(data.habits);
      setTodayLogs(data.todayLogs);
      setWeekLogs(data.weekLogs);
    } catch {
      // silent
    } finally {
      setLoadingHabits(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchHabits();
  }, [fetchTasks, fetchHabits]);

  // ── Task mutations ────────────────────────────────────────────────────────

  const handleAddTask = async (input: CreateTaskInput) => {
    const { data } = await apiFetch<{ data: Task }>('/api/herramientas/tareas/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    setTasks((prev) => [...prev, data]);
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null }
          : t
      )
    );
    try {
      await apiFetch(`/api/herramientas/tareas/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
    } catch {
      // Rollback on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !completed, completed_at: null } : t
        )
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await apiFetch(`/api/herramientas/tareas/tasks/${id}`, { method: 'DELETE' });
    } catch {
      fetchTasks(); // Refetch on failure
    }
  };

  // ── Habit mutations ───────────────────────────────────────────────────────

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    if (completed) {
      // Optimistic: add log
      const fakeLog: HabitLog = {
        id: `temp-${Date.now()}`,
        habit_id: habitId,
        user_id: '',
        logged_date: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      };
      setTodayLogs((prev) => [...prev, fakeLog]);
      try {
        await apiFetch(`/api/herramientas/tareas/habits/${habitId}/log`, { method: 'POST' });
        fetchHabits(); // Sync week logs
      } catch {
        setTodayLogs((prev) => prev.filter((l) => l.habit_id !== habitId));
      }
    } else {
      // Optimistic: remove log
      const removed = todayLogs.filter((l) => l.habit_id === habitId);
      setTodayLogs((prev) => prev.filter((l) => l.habit_id !== habitId));
      try {
        await apiFetch(`/api/herramientas/tareas/habits/${habitId}/log`, { method: 'DELETE' });
        fetchHabits();
      } catch {
        setTodayLogs((prev) => [...prev, ...removed]);
      }
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setTodayLogs((prev) => prev.filter((l) => l.habit_id !== habitId));
    try {
      await apiFetch(`/api/herramientas/tareas/habits/${habitId}`, { method: 'DELETE' });
    } catch {
      fetchHabits();
    }
  };

  const handleAddHabit = async (name: string) => {
    await apiFetch('/api/herramientas/tareas/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    fetchHabits();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const isLoading = tab === 'tareas' ? loadingTasks : tab === 'habitos' ? loadingHabits : (loadingTasks || loadingHabits);

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/galodev_tools_bg.png"
          alt="Background"
          fill
          className="object-cover opacity-70 mix-blend-screen"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[#020412]/80 backdrop-blur-[2px]" />
      </div>

      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 500,
            top: '-8%', left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Header */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between"
        style={{
          padding: '0 16px',
          height: '56px',
          background: 'rgba(2,4,18,0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Link
          href="/herramientas"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-[13px] hidden sm:block">Panel</span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)' }}
          >
            <CheckSquare size={13} style={{ color: TOOL_ACCENT }} />
          </div>
          <span className="text-[14px] font-semibold text-white/80">Tareas</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <LogOut size={14} />
          <span className="hidden sm:block">Salir</span>
        </button>
      </header>

      {/* Content */}
      <main
        className="relative z-10 overflow-x-hidden"
        style={{ paddingTop: '56px', paddingBottom: '80px', minHeight: '100vh' }}
      >
        <div className="w-full max-w-[520px] mx-auto px-4 py-5 box-border">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center pt-20"
              >
                <Loader2 size={28} className="animate-spin" style={{ color: TOOL_ACCENT }} />
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {tab === 'tareas' && (
                  <>
                    <DayStats tasks={tasks} />
                    <TaskInput onAdd={handleAddTask} />
                    <FilterBar filter={filter} onChange={setFilter} />
                    <TaskList
                      tasks={tasks}
                      filter={filter}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  </>
                )}

                {tab === 'habitos' && (
                  <HabitTracker
                    habits={habits}
                    todayLogs={todayLogs}
                    weekLogs={weekLogs}
                    onToggleHabit={handleToggleHabit}
                    onDeleteHabit={handleDeleteHabit}
                    onAddHabit={handleAddHabit}
                  />
                )}

                {tab === 'resumen' && (
                  <Dashboard
                    tasks={tasks}
                    habits={habits}
                    todayLogs={todayLogs}
                    weekLogs={weekLogs}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 flex"
        style={{
          height: '64px',
          background: 'rgba(2,4,18,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200"
              style={{
                color: active ? TOOL_ACCENT : 'rgba(255,255,255,0.3)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ opacity: active ? 1 : 0.7 }}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute top-0 w-12 h-0.5 rounded-full"
                  style={{ background: TOOL_ACCENT }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
