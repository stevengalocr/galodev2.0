'use client';

import { Home, Briefcase, Sunrise, Sun, Moon, SlidersHorizontal } from 'lucide-react';
import type { ActiveFilter, Location, TimeSlot } from '@/lib/tareas/types';

interface Props {
  filter: ActiveFilter;
  onChange: (f: ActiveFilter) => void;
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

const hasFilter = (f: ActiveFilter) => f.location !== null || f.timeSlot !== null;

export default function FilterBar({ filter, onChange }: Props) {
  const chip = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 9px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.01em',
    border: active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
    color: active ? '#6ee7b7' : 'rgba(255,255,255,0.28)',
    transition: 'all 0.15s ease',
    WebkitTapHighlightColor: 'transparent',
  });

  const active = hasFilter(filter);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal size={10} style={{ color: active ? '#6ee7b7' : 'rgba(255,255,255,0.22)' }} />
        <span
          className="text-[10px] font-bold tracking-[0.13em] uppercase"
          style={{ color: active ? 'rgba(110,231,183,0.7)' : 'rgba(255,255,255,0.22)' }}
        >
          Filtrar lista
        </span>
        {active && (
          <button
            onClick={() => onChange({ location: null, timeSlot: null })}
            className="ml-auto text-[10px] font-semibold"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            limpiar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {LOCATION_OPTS.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => onChange({ ...filter, location: filter.location === value ? null : value })}
            style={chip(filter.location === value)}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
        <div className="w-px h-5 self-center" style={{ background: 'rgba(255,255,255,0.07)' }} />
        {TIME_OPTS.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => onChange({ ...filter, timeSlot: filter.timeSlot === value ? null : value })}
            style={chip(filter.timeSlot === value)}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
