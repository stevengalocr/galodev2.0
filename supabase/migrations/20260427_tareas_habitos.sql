-- ── Tareas: tasks, habits, habit_logs ────────────────────────────────────────

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text         text        NOT NULL,
  location     text        CHECK (location IN ('Casa', 'Oficina')),
  time_slot    text        CHECK (time_slot IN ('Manana', 'Tarde', 'Noche')),
  completed    boolean     NOT NULL DEFAULT false,
  priority     text        NOT NULL DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven sus tareas"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS tasks_user_id_idx    ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks(created_at);

-- habits
CREATE TABLE IF NOT EXISTS habits (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  description text,
  icon        text,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven sus habitos"
  ON habits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);

-- habit_logs
CREATE TABLE IF NOT EXISTS habit_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id    uuid        NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date date        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (habit_id, logged_date)
);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven sus habit_logs"
  ON habit_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS habit_logs_habit_id_idx     ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS habit_logs_logged_date_idx  ON habit_logs(logged_date);
CREATE INDEX IF NOT EXISTS habit_logs_user_date_idx    ON habit_logs(user_id, logged_date);
