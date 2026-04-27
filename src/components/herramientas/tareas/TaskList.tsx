'use client';

import { AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import type { Task, ActiveFilter } from '@/lib/tareas/types';

interface Props {
  tasks: Task[];
  filter: ActiveFilter;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

function applyFilter(tasks: Task[], filter: ActiveFilter): Task[] {
  return tasks.filter((t) => {
    if (filter.location && t.location !== filter.location) return false;
    if (filter.timeSlot && t.time_slot !== filter.timeSlot) return false;
    return true;
  });
}

export default function TaskList({ tasks, filter, onToggle, onDelete }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const pending = applyFilter(tasks.filter((t) => !t.completed), filter);
  const completed = applyFilter(
    tasks.filter(
      (t) =>
        t.completed &&
        t.completed_at &&
        t.completed_at.slice(0, 10) === today
    ),
    filter
  );

  return (
    <div>
      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-5">
          <p className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-white/30 mb-2.5">
            Pendientes ({pending.length})
          </p>
          <AnimatePresence mode="popLayout">
            {pending.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed today */}
      {completed.length > 0 && (
        <div>
          <p className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-white/20 mb-2.5">
            Completadas hoy ({completed.length})
          </p>
          <AnimatePresence mode="popLayout">
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {pending.length === 0 && completed.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[32px] mb-3">✅</p>
          <p className="text-[14px] text-white/30">
            {tasks.length === 0
              ? 'Agregá tu primera tarea'
              : 'Sin tareas que coincidan con el filtro'}
          </p>
        </div>
      )}
    </div>
  );
}
