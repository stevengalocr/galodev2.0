# Supabase — GaloDev

## Cómo correr la migración

### Opción A — Supabase Dashboard (recomendada)

1. Entrá a https://supabase.com/dashboard → tu proyecto GaloDevUtils
2. Menú izquierdo → **SQL Editor**
3. Click en **New query**
4. Copiá y pegá el contenido de `migrations/20260425_crear_post.sql`
5. Click **Run** ✅

### Opción B — Supabase CLI

```bash
# Instalar CLI (si no la tenés)
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref awzzjmmckxxhuqxgbzvh

# Correr migración
supabase db push
```

## Qué crea esta migración

| Objeto | Tipo | Descripción |
|--------|------|-------------|
| `generation_jobs` | Tabla | Guarda cada post generado con su estado, costo, draft y URLs de imágenes |
| `posts` | Storage bucket | Almacena los PNGs de cada slide (público para URLs directas) |
| `jobs_summary` | Vista | Vista simplificada para el historial de posts |
| RLS policies | Seguridad | Solo el usuario autenticado puede ver/editar sus jobs |

## Estructura del proyecto Supabase

```
Proyecto: GaloDevUtils
URL: https://awzzjmmckxxhuqxgbzvh.supabase.co
```

### Tablas existentes
- `generation_jobs` — posts generados por Crear Post

### Buckets existentes
- `posts` — imágenes PNG de los slides (público)
