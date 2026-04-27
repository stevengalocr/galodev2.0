import type { Location, TimeSlot, Priority } from './types';

export const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'Casa', label: 'Casa' },
  { value: 'Oficina', label: 'Oficina' },
];

export const TIME_SLOTS: { value: TimeSlot; label: string }[] = [
  { value: 'Manana', label: 'Mañana' },
  { value: 'Tarde', label: 'Tarde' },
  { value: 'Noche', label: 'Noche' },
];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'alta', label: 'Alta', color: '#ef4444' },
  { value: 'media', label: 'Media', color: '#f59e0b' },
  { value: 'baja', label: 'Baja', color: '#6b7280' },
];

export const DEFAULT_HABITS: { name: string; description: string }[] = [
  { name: 'Inglés 45 min', description: 'Práctica de inglés diaria' },
  { name: 'Proyecto principal 1h', description: 'Deep work en tu proyecto' },
  { name: 'Portfolio / freelance', description: 'Trabajo en tu portfolio' },
  { name: 'Ejercicio', description: 'Actividad física' },
];

export const TOOL_ACCENT = '#10B981';
export const TOOL_ACCENT_GLOW = 'rgba(16,185,129,0.12)';
export const TOOL_ACCENT_GLOW_STRONG = 'rgba(16,185,129,0.26)';
export const TOOL_ACCENT_BORDER = 'rgba(16,185,129,0.28)';
export const TOOL_ACCENT_BORDER_HOVER = 'rgba(16,185,129,0.55)';
export const TOOL_ACCENT_TEXT = '#6ee7b7';

export const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const PRIORITY_COLORS: Record<Priority, string> = {
  alta: '#ef4444',
  media: '#f59e0b',
  baja: '#6b7280',
};
