# ⚠️ PENDIENTE — Para que Crear Post funcione al 100%

## 1. Variables de entorno faltantes (.env.local)

Agregá estas líneas a tu `.env.local`:

```env
# Claude / Anthropic (para generación de copy)
ANTHROPIC_API_KEY=sk-ant-...

# Nano Banana Pro (para generación de fondos)
NANO_BANANA_API_KEY=nb-...
NANO_BANANA_BASE_URL=https://api.nanobanana.io
```

### Dónde conseguirlos

| Variable | Dónde | Costo estimado |
|----------|-------|----------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com | ~$0.04/carrusel |
| `NANO_BANANA_API_KEY` | nanobanana.io/dashboard | ~$0.11/carrusel |

---

## 2. Supabase — Tabla generation_jobs

Ejecutá este SQL en el SQL Editor de tu proyecto Supabase:

```sql
create table public.generation_jobs (
  id            uuid primary key default gen_random_uuid(),
  post_type     text not null,
  pilar         text not null,
  estructura    text,
  idea          text not null,
  publico       text not null,
  objetivo      text not null,
  variant_chosen text,
  draft_full    jsonb,
  images        jsonb default '[]'::jsonb,
  total_cost_usd decimal(8,4) default 0,
  status        text not null default 'pending',
  user_id       uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

-- RLS: solo el usuario autenticado puede ver sus propios jobs
alter table public.generation_jobs enable row level security;

create policy "Users can manage own jobs"
  on public.generation_jobs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## 3. Supabase Storage — Bucket "posts"

En tu panel de Supabase → Storage → New bucket:

- **Nombre:** `posts`
- **Public:** ✅ Activado (para que las imágenes sean accesibles por URL pública)

---

## 4. Nano Banana API — Confirmar endpoint

La integración usa el endpoint `/v1/generate`. Cuando tengas acceso al dashboard de Nano Banana, confirmá:
- La URL base exacta
- El formato del body (ya implementado según la documentación estándar)
- Si el response tiene `url`, `width`, `height`, `cost_usd` (estructura usada en `nano-banana.ts`)

Si la API tiene diferente estructura, actualizá `src/lib/crear-post/nano-banana.ts` → función `generateBackground`.

---

## 5. (Opcional) Notion API — Guardar en Pipeline

Si querés conectar el botón "Guardar en Notion Pipeline" del paquete final:

```env
NOTION_API_TOKEN=secret_...
NOTION_PIPELINE_DB_ID=...  # ID de la base de datos del Pipeline
```

Este feature no está implementado en el MVP. Se agrega en Fase 2.

---

## Resumen rápido

```
✅ UI completa (9 pasos)
✅ Satori overlays (7 arquetipos)
✅ API copy (Claude) — solo falta ANTHROPIC_API_KEY
✅ API images (Nano Banana + Satori) — falta NANO_BANANA_API_KEY
✅ ZIP download
✅ ToolsGrid actualizado
⏳ Supabase table — ejecutar SQL arriba
⏳ Supabase Storage bucket "posts" — crear manualmente
⏳ .env.local — agregar las 3 variables
```
