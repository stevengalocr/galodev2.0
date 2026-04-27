-- ============================================================
-- GaloDev — Crear Post: tabla generation_jobs + bucket posts
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── 1. Tabla generation_jobs ────────────────────────────────────────────────

create table if not exists public.generation_jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade,
  post_type       text not null check (post_type in ('carrusel','post_unico','story','anuncio')),
  pilar           text not null check (pilar in ('tutorial_tecnico','freelance','herramientas','proyecto')),
  estructura      text check (estructura in ('lista_numerica','comparativa','storytelling','stack','case_study','error_mito')),
  idea            text not null,
  publico         text not null check (publico in ('dev_junior','dev_senior','freelancer','dueno_negocio','mixto')),
  objetivo        text not null check (objetivo in ('guardados','comparticiones','dms','clicks_galodev')),
  variant_chosen  text check (variant_chosen in ('A','B')),
  draft_full      jsonb,
  images          jsonb default '[]'::jsonb,
  total_cost_usd  numeric(10,4) default 0,
  status          text not null default 'pending'
                  check (status in ('pending','generating','done','failed','partial')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists generation_jobs_updated_at on public.generation_jobs;
create trigger generation_jobs_updated_at
  before update on public.generation_jobs
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_generation_jobs_user_id on public.generation_jobs(user_id);
create index if not exists idx_generation_jobs_status on public.generation_jobs(status);
create index if not exists idx_generation_jobs_created_at on public.generation_jobs(created_at desc);

-- ── 2. Row Level Security ───────────────────────────────────────────────────

alter table public.generation_jobs enable row level security;

-- Steven (owner) can do everything — no external users for now
create policy "Owner full access"
  on public.generation_jobs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 3. Storage bucket 'posts' ───────────────────────────────────────────────
-- (Ejecutar en Supabase Dashboard → Storage → New bucket si no existe)
-- O ejecutar este SQL:

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'posts',
  'posts',
  true,                          -- público para que las URLs funcionen directamente
  10485760,                      -- 10 MB por archivo
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read posts"
  on storage.objects for select
  using (bucket_id = 'posts');

create policy "Auth users upload posts"
  on storage.objects for insert
  with check (bucket_id = 'posts' and auth.role() = 'authenticated');

create policy "Auth users update posts"
  on storage.objects for update
  using (bucket_id = 'posts' and auth.role() = 'authenticated');

create policy "Auth users delete posts"
  on storage.objects for delete
  using (bucket_id = 'posts' and auth.role() = 'authenticated');

-- ── 4. Vista rápida para historial ─────────────────────────────────────────

create or replace view public.jobs_summary as
select
  id,
  post_type,
  pilar,
  estructura,
  left(idea, 80) as idea_preview,
  publico,
  objetivo,
  variant_chosen,
  jsonb_array_length(images) as slides_count,
  total_cost_usd,
  status,
  created_at
from public.generation_jobs
order by created_at desc;

-- ============================================================
-- ✅ Listo. Costo total de esta migración: $0
-- ============================================================
