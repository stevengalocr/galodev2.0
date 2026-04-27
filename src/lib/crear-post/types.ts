import { z } from 'zod';

// ── Enums ────────────────────────────────────────────────────────────────────

export const POST_TYPES = ['carrusel', 'post_unico', 'story', 'anuncio'] as const;
export const PILARES = ['tutorial_tecnico', 'freelance', 'herramientas', 'proyecto'] as const;
export const ESTRUCTURAS = [
  'lista_numerica',
  'comparativa',
  'storytelling',
  'stack',
  'case_study',
  'error_mito',
] as const;
export const PUBLICOS = [
  'dev_junior',
  'dev_senior',
  'freelancer',
  'dueno_negocio',
  'mixto',
] as const;
export const OBJETIVOS = ['guardados', 'comparticiones', 'dms', 'clicks_galodev'] as const;
export const SLIDE_TYPES = ['hook', 'roadmap', 'body', 'summary', 'cta'] as const;
export const RESOLUTION_MODES = ['1K', '2K'] as const;
export const GENERATION_MODES = ['standard', 'batch'] as const;

// ── Zod Schemas ──────────────────────────────────────────────────────────────

export const SlideSchema = z.object({
  number: z.number().int().positive(),
  type: z.enum(SLIDE_TYPES),
  titulo: z.string(),
  subtitulo: z.string().optional(),
  cuerpo: z.string().optional(),
  snippet: z.string().optional(),
  notaDiseno: z.string(),
  // For post_unico: Claude writes the FULL Imagen prompt (the complete image, text included)
  imagenPrompt: z.string().optional(),
});

export const CopyDraftSchema = z.object({
  variantLabel: z.enum(['A', 'B']),
  approach: z.string().max(120),
  title: z.string().max(80),
  slides: z.array(SlideSchema).min(1).max(8),
  caption: z.string().max(2200),
  hashtags: z.array(z.string()).min(5).max(10),
  cta: z.string(),
  hookAlternativo: z.string(),
});

export const CopyDraftPairSchema = z.object({
  draftId: z.string().uuid(),
  model: z.string(),
  tokensUsed: z.number(),
  costUsd: z.number(),
  generatedAt: z.string().datetime(),
  variants: z.tuple([CopyDraftSchema, CopyDraftSchema]),
});

export const GenerateCopyRequestSchema = z.object({
  postType: z.enum(POST_TYPES),
  pilar: z.enum(PILARES),
  estructura: z.enum(ESTRUCTURAS).optional(),
  idea: z.string().max(280).optional(),
  publico: z.enum(PUBLICOS),
  objetivo: z.enum(OBJETIVOS),
  datosDuros: z.string().max(2000).optional(),
  slides: z.union([z.literal('auto'), z.number().int().min(4).max(8)]).default('auto'),
  excludePrevious: z.array(z.string().uuid()).optional(),
});

export const GenerateImagesRequestSchema = z.object({
  jobId: z.string().uuid(),
  draftId: z.string().uuid(),
  draft: CopyDraftSchema,
  postType: z.enum(POST_TYPES).default('carrusel'),
  pilar: z.enum(PILARES),
  estructura: z.enum(ESTRUCTURAS).optional(),
  resolution: z.enum(RESOLUTION_MODES).default('2K'),
  mode: z.enum(GENERATION_MODES).default('standard'),
  confirmedCostUsd: z.number(),
});

// ── TypeScript Types ─────────────────────────────────────────────────────────

export type PostType = (typeof POST_TYPES)[number];
export type Pilar = (typeof PILARES)[number];
export type Estructura = (typeof ESTRUCTURAS)[number];
export type Publico = (typeof PUBLICOS)[number];
export type Objetivo = (typeof OBJETIVOS)[number];
export type Slide = z.infer<typeof SlideSchema>;
export type CopyDraft = z.infer<typeof CopyDraftSchema>;
export type CopyDraftPair = z.infer<typeof CopyDraftPairSchema>;
export type GenerateCopyRequest = z.infer<typeof GenerateCopyRequestSchema>;
export type GenerateImagesRequest = z.infer<typeof GenerateImagesRequestSchema>;

// ── SSE Progress Events ──────────────────────────────────────────────────────

export type ProgressEvent =
  | { type: 'background_started' }
  | { type: 'background_done'; imageUrl: string; elapsedMs: number; costUsd: number }
  | { type: 'background_fallback'; reason: string }
  | { type: 'slide_started'; slide: number; archetype: string }
  | { type: 'slide_done'; slide: number; imageUrl: string; elapsedMs: number }
  | { type: 'slide_failed'; slide: number; error: string; willRetry: boolean }
  | { type: 'job_done'; totalCostUsd: number; imageUrls: string[]; status: 'done' | 'partial' }
  | { type: 'job_aborted'; reason: string };

// ── Flow Steps ───────────────────────────────────────────────────────────────

export type FlowStep =
  | 'idle'
  | 'type_selection'
  | 'briefing'
  | 'generating_copy'
  | 'review_copy'
  | 'approval_gate'
  | 'generating_images'
  | 'final_package';

// ── Job record (mirrors Supabase table) ─────────────────────────────────────

export interface GenerationJob {
  id: string;
  post_type: PostType;
  pilar: Pilar;
  estructura?: Estructura;
  idea: string;
  publico: Publico;
  objetivo: Objetivo;
  variant_chosen: 'A' | 'B';
  draft_full: CopyDraft;
  images: string[];
  total_cost_usd: number;
  status: 'pending' | 'generating' | 'done' | 'failed' | 'partial';
  created_at: string;
}
