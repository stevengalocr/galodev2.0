export type Location = 'Casa' | 'Oficina';
export type TimeSlot = 'Manana' | 'Tarde' | 'Noche';
export type Priority = 'alta' | 'media' | 'baja';

export interface Task {
  id: string;
  user_id: string;
  text: string;
  location: Location | null;
  time_slot: TimeSlot | null;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  logged_date: string;
  created_at: string;
}

export interface CreateTaskInput {
  text: string;
  location?: Location | null;
  time_slot?: TimeSlot | null;
  priority?: Priority;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  text?: string;
  location?: Location | null;
  time_slot?: TimeSlot | null;
  completed?: boolean;
  priority?: Priority;
  due_date?: string | null;
  completed_at?: string | null;
}

export interface CreateHabitInput {
  name: string;
  description?: string | null;
  icon?: string | null;
}

export interface UpdateHabitInput {
  name?: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
}

export type ActiveFilter = {
  location: Location | null;
  timeSlot: TimeSlot | null;
};
