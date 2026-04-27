'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { LOCATIONS, TIME_SLOTS, PRIORITY_COLORS } from '@/lib/tareas/constants';
import type { Task } from '@/lib/tareas/types';

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TIME_LABELS: Record<string, string> = {
  Manana: '🌅',
  Tarde: '☀️',
  Noche: '🌙',
};
const LOCATION_LABELS: Record<string, string> = {
  Casa: '🏠',
  Oficina: '💼',
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: task.completed ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-center gap-3 rounded-xl px-3 py-3 group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '6px',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={() => setShowDelete(false)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(task.id, !task.completed); }}
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          border: task.completed
            ? '2px solid #10B981'
            : '2px solid rgba(255,255,255,0.2)',
          background: task.completed ? 'rgba(16,185,129,0.2)' : 'transparent',
        }}
      >
        {task.completed && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="#10B981"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </button>

      {/* Text + badges */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-medium leading-snug truncate"
          style={{
            color: task.completed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.88)',
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.text}
        </p>
        {(task.location || task.time_slot) && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {task.priority !== 'media' && (
              <span
                className="text-[10px] font-bold"
                style={{ color: PRIORITY_COLORS[task.priority] }}
              >
                ●
              </span>
            )}
            {task.location && (
              <span className="text-[11px] text-white/30">
                {LOCATION_LABELS[task.location]} {task.location}
              </span>
            )}
            {task.time_slot && (
              <span className="text-[11px] text-white/30">
                {TIME_LABELS[task.time_slot]}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-150"
        style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Eliminar tarea"
      >
        <Trash2 size={13} style={{ color: 'rgba(239,68,68,0.7)' }} />
      </button>
    </motion.div>
  );
}
