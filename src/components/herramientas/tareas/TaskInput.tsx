'use client';

import { useState, useRef } from 'react';
import { Plus, Loader2, Home, Briefcase, Sunrise, Sun, Moon } from 'lucide-react';
import { TOOL_ACCENT } from '@/lib/tareas/constants';
import type { Location, TimeSlot, CreateTaskInput } from '@/lib/tareas/types';

interface Props {
  onAdd: (input: CreateTaskInput) => Promise<void>;
}

const LOCATION_OPTS: { value: Location; label: string; Icon: React.ElementType }[] = [
  { value: 'Casa', label: 'Casa', Icon: Home },
  { value: 'Oficina', label: 'Oficina', Icon: Briefcase },
];

const TIME_OPTS: { value: TimeSlot; label: string; Icon: React.ElementType }[] = [
  { value: 'Manana', label: 'Mañana', Icon: Sunrise },
  { value: 'Tarde', label: 'Tarde', Icon: Sun },
  { value: 'Noche', label: 'Noche', Icon: Moon },
];

export default function TaskInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      await onAdd({ text: text.trim(), location, time_slot: timeSlot });
      setText('');
      setLocation(null);
      setTimeSlot(null);
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const chip = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? `1px solid rgba(16,185,129,0.5)` : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(16,185,129,0.14)' : 'rgba(255,255,255,0.04)',
    color: active ? '#6ee7b7' : 'rgba(255,255,255,0.38)',
    transition: 'all 0.15s ease',
    WebkitTapHighlightColor: 'transparent',
    letterSpacing: '0.01em',
  });

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(5,7,20,0.97)',
          border: `1px solid ${text.trim() ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.09)'}`,
          transition: 'border-color 0.2s ease',
        }}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nueva tarea..."
            className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/22 outline-none min-w-0"
            autoComplete="off"
            autoCorrect="off"
          />
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25"
            style={{ background: text.trim() ? TOOL_ACCENT : 'rgba(255,255,255,0.07)' }}
          >
            {loading
              ? <Loader2 size={14} className="text-white animate-spin" />
              : <Plus size={16} className="text-white" />
            }
          </button>
        </div>

        {/* Selector row */}
        <div
          className="px-4 pb-3.5 flex flex-wrap gap-1.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="pt-2.5 flex flex-wrap gap-1.5">
            {LOCATION_OPTS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLocation(location === value ? null : value)}
                style={chip(location === value)}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
          <div
            className="w-px self-stretch mt-2.5 mb-0.5 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div className="pt-2.5 flex flex-wrap gap-1.5">
            {TIME_OPTS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTimeSlot(timeSlot === value ? null : value)}
                style={chip(timeSlot === value)}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
