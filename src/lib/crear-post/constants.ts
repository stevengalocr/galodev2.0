import type { Estructura, Pilar, PostType, Publico, Objetivo } from './types';

// ── Pilar display labels & colors ────────────────────────────────────────────

export const PILAR_LABELS: Record<Pilar, string> = {
  tutorial_tecnico: 'Tutorial técnico',
  freelance: 'Freelance / Negocios',
  herramientas: 'Herramientas / Stack',
  proyecto: 'Proyectos / Casos',
};

export const PILAR_ACCENT_COLORS: Record<Pilar, string> = {
  tutorial_tecnico: '#3B82F6',
  freelance: '#10B981',
  herramientas: '#8B5CF6',
  proyecto: '#F59E0B',
};

// ── Estructura display labels ────────────────────────────────────────────────

export const ESTRUCTURA_LABELS: Record<Estructura, string> = {
  lista_numerica: 'Lista numérica',
  comparativa: 'Comparativa / VS',
  storytelling: 'Storytelling',
  stack: 'Stack / Setup',
  case_study: 'Case Study',
  error_mito: 'Error / Mito',
};

export const ESTRUCTURA_DESCRIPTIONS: Record<Estructura, string> = {
  lista_numerica: '5 cosas que debés saber de X',
  comparativa: 'A vs B, cuál elegir y por qué',
  storytelling: 'Cómo pasé de X a Y (mi historia)',
  stack: 'Mi stack completo para proyectos freelance',
  case_study: 'Caso real: cómo resolví X problema',
  error_mito: 'El error más común en X (y cómo evitarlo)',
};

// ── Post type definitions ────────────────────────────────────────────────────

export interface PostTypeConfig {
  id: PostType;
  icon: string;
  title: string;
  description: string;
  slides: string;
  tiempo: string;
  costoEst: string;
  needsEstructura: boolean;
}

export const POST_TYPE_CONFIGS: PostTypeConfig[] = [
  {
    id: 'carrusel',
    icon: '🎬',
    title: 'Carrusel',
    description: 'Tema con varios puntos, lista o comparativa',
    slides: '4–8',
    tiempo: '~2 min',
    costoEst: '~$0.60',
    needsEstructura: true,
  },
  {
    id: 'post_unico',
    icon: '🖼️',
    title: 'Post único',
    description: 'Una imagen, un mensaje poderoso',
    slides: '1',
    tiempo: '~30 seg',
    costoEst: '~$0.15',
    needsEstructura: false,
  },
  {
    id: 'story',
    icon: '📖',
    title: 'Story serie',
    description: '3–5 slides verticales para Stories',
    slides: '3–5',
    tiempo: '~1 min',
    costoEst: '~$0.57',
    needsEstructura: false,
  },
  {
    id: 'anuncio',
    icon: '📢',
    title: 'Anuncio / Venta',
    description: '5 slides enfocados a conversión',
    slides: '5',
    tiempo: '~1.5 min',
    costoEst: '~$0.71',
    needsEstructura: true,
  },
];

// ── Publico / Objetivo labels ────────────────────────────────────────────────

export const PUBLICO_LABELS: Record<Publico, string> = {
  dev_junior: 'Devs Junior',
  dev_senior: 'Devs Senior',
  freelancer: 'Freelancers',
  dueno_negocio: 'Dueños de negocio',
  mixto: 'Mixto',
};

export const OBJETIVO_LABELS: Record<Objetivo, string> = {
  guardados: 'Guardados',
  comparticiones: 'Comparticiones',
  dms: 'DMs / Mensajes directos',
  clicks_galodev: 'Clicks a galodev.com',
};

// ── Geometric themes per estructura (for Nano Banana background prompt) ───────

export const GEOMETRIC_THEMES: Record<Estructura, string> = {
  lista_numerica: 'grid of fine converging lines, structured pattern suggesting organization',
  comparativa: 'two fields of particles meeting at center, duality composition',
  storytelling: 'flowing wave pattern suggesting narrative journey',
  stack: 'network topology, interconnected nodes',
  case_study: 'diagonal particle ascent from bottom-left to top-right',
  error_mito: 'subtle glitch distortion, fractured grid pattern',
};

// ── Archetype sequence per estructura ───────────────────────────────────────
// Each index = slide position. Total slides adapts 4-8.
// We use the first N archetypes based on how many slides Claude decided.

export type Archetype = 'Hero' | 'Lista' | 'Stat' | 'Quote' | 'Codigo' | 'Versus' | 'HeroCTA';

export const STRUCTURE_ARCHETYPES: Record<Estructura, Archetype[]> = {
  lista_numerica: ['Hero', 'Lista', 'Lista', 'Stat', 'Lista', 'Quote', 'Lista', 'HeroCTA'],
  comparativa: ['Hero', 'Versus', 'Codigo', 'Versus', 'Stat', 'Versus', 'Quote', 'HeroCTA'],
  storytelling: ['Hero', 'Quote', 'Lista', 'Stat', 'Codigo', 'Lista', 'Quote', 'HeroCTA'],
  stack: ['Hero', 'Lista', 'Codigo', 'Codigo', 'Stat', 'Lista', 'Codigo', 'HeroCTA'],
  case_study: ['Hero', 'Stat', 'Versus', 'Codigo', 'Stat', 'Lista', 'Quote', 'HeroCTA'],
  error_mito: ['Hero', 'Versus', 'Codigo', 'Versus', 'Lista', 'Quote', 'Versus', 'HeroCTA'],
};

// Fallback for post types without estructura
export const DEFAULT_ARCHETYPES: Archetype[] = ['Hero', 'Lista', 'Stat', 'Quote', 'HeroCTA'];

// ── Cost calculations ────────────────────────────────────────────────────────

export const NB_COST_PER_IMAGE_2K = 0.134;
export const NB_COST_PER_IMAGE_1K = 0.067;
export const NB_BACKGROUND_COST = 0.11; // 1 background image

export function estimateCost(slides: number, mode: '1K' | '2K', genMode: 'standard' | 'batch') {
  const perImage = mode === '2K' ? NB_COST_PER_IMAGE_2K : NB_COST_PER_IMAGE_1K;
  const imageCost = NB_BACKGROUND_COST * (genMode === 'batch' ? 0.5 : 1);
  const claudeCost = 0.05;
  return parseFloat((claudeCost + imageCost).toFixed(3));
}

// ── Rate limit ────────────────────────────────────────────────────────────────

export const MAX_GENERATIONS_PER_HOUR = 10;
