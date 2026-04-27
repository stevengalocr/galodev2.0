import type { Estructura, Slide } from './types';

export const BRAND_STYLE_PRESET = `[GALODEV BRAND — IMMUTABLE]
Palette: deep slate #020617 / #0F172A · electric blue #3B82F6 · deep blue #1D4ED8.
Brand logo colors allowed as tiny accents only (React #61DAFB, Next.js white, TS #3178C6, Supabase #3ECF8E).
Style: Vercel · Linear · Stripe dark editorial — minimalist, premium, confident, abstract.
Forbidden: faces · people · photorealistic hands · stock clichés · bright colors outside palette · ANY text inside image · watermarks.`;

// ── Per-slide Imagen prompt ───────────────────────────────────────────────────
//
// Called ONCE PER SLIDE so each image is unique and topic-specific.

export function buildSlideBackgroundPrompt(
  slide: Slide,
  topic: string,
  slideIndex: number,
  totalSlides: number,
): string {
  const isHook = slideIndex === 0;
  const isCTA = slideIndex === totalSlides - 1;

  const slideContent = [slide.titulo, slide.subtitulo].filter(Boolean).join(' — ');
  const visualConcept = deriveVisualConcept(slide.titulo, topic, slide.type);

  const compositionHint = isHook
    ? 'dramatic full-bleed composition, strong single focal point, high visual impact'
    : isCTA
    ? 'radiating warm energy from center, invitation and connection, closing energy'
    : 'editorial supporting background, generous negative space, balanced texture';

  return `${BRAND_STYLE_PRESET}

[UNIQUE BACKGROUND — SLIDE ${slideIndex + 1}/${totalSlides}]
Carousel: "${topic}"
This slide: "${slideContent}"

Visual concept: ${visualConcept}
Composition: ${compositionHint}
Design note from content: ${slide.notaDiseno || 'abstract tech aesthetic'}

Technical:
— 4:5 portrait 1080×1350px
— Very dark base (#020617), this image composited at 20% opacity
— Rich visual texture that reads clearly even at low opacity
— NO text · NO faces · NO logos (except very abstract brand color hints)
— Abstract generative / editorial art style`;
}

function deriveVisualConcept(titulo: string, topic: string, type: string): string {
  const t = `${titulo} ${topic}`.toLowerCase();

  // Direct tech topic matches
  if (t.includes('chatgpt') && t.includes('claude'))
    return 'two abstract AI energy fields facing each other — one emerald, one amber — separated by a thin electric divide, deep cosmic dark background';
  if (t.includes('chatgpt') || t.includes('openai'))
    return 'abstract neural network flowing in soft emerald green, synaptic connections on very dark background, AI brain topology';
  if (t.includes('claude') || t.includes('anthropic'))
    return 'abstract wave interference pattern in warm amber tones, flowing harmonic curves on deep dark background';
  if (t.includes('next.js') || t.includes('nextjs') || t.includes('next js'))
    return 'abstract server-edge routing diagram, geometric arrows flowing from server to client, inspired by Vercel\'s aesthetic on pure black';
  if (t.includes('react'))
    return 'orbital electron rings around glowing nucleus atom, electric cyan particles in circular motion, dark space background';
  if (t.includes('typescript') || (t.includes(' ts ') && t.includes('type')))
    return 'abstract type system graph, blue geometric nodes connected by strict typed edges, structural rigid beauty';
  if (t.includes('tailwind'))
    return 'abstract utility-first grid system, modular design tokens floating as colored blocks, cyan accent on dark';
  if (t.includes('supabase') || t.includes('postgres') || t.includes('base de datos') || t.includes('database'))
    return 'abstract database tree structure, branching nodes with glowing green connections, deep dark background';
  if (t.includes('api') || t.includes('endpoint') || t.includes('rest') || t.includes('graphql'))
    return 'abstract API request/response flow, glowing data packets traveling between endpoints, minimal diagram aesthetic';
  if (t.includes('ia') || t.includes('inteligencia artificial') || t.includes(' ai ') || t.includes('llm') || t.includes('gpt'))
    return 'abstract neural network topology, electric blue synaptic fire spreading across dark space, generative intelligence visualization';
  if (t.includes('freelance') || t.includes('cliente') || t.includes('proyecto'))
    return 'abstract project constellation, orbiting task nodes connected to central hub, professional dark workspace aesthetic';
  if (t.includes('plugin') || t.includes('extensi') || t.includes('integra') || t.includes('modular'))
    return 'abstract interlocking modular blocks floating in dark space, each module glowing at connection points';
  if (t.includes('velocidad') || t.includes('performance') || t.includes('rápid') || t.includes('speed') || t.includes('fast'))
    return 'abstract velocity visualization, radial motion streaks from vanishing point, performance curve ascending, dark background';
  if (t.includes('código') || t.includes('code') || t.includes('snippet') || t.includes('programac'))
    return 'abstract code matrix aesthetic, columns of glowing blue data-stream characters on near-black, premium terminal art';
  if (t.includes('contexto') || t.includes('token') || t.includes('200k') || t.includes('context'))
    return 'abstract infinite document scrolling, layered text streams fading into depth, vast data ocean aesthetic';
  if (t.includes('stack') || t.includes('herramienta') || t.includes('tool'))
    return 'abstract technology layer stack, floating transparent planes with gradient connections between layers';
  if (t.includes('deploy') || t.includes('cloud') || t.includes('hosting') || t.includes('servidor'))
    return 'abstract cloud infrastructure topology, floating nodes connected by glowing mesh, serverless aesthetic';
  if (t.includes('seguridad') || t.includes('auth') || t.includes('security') || t.includes('jwt'))
    return 'abstract security shield visualization, concentric protective rings, encrypted data particles on dark background';
  if (t.includes('dinero') || t.includes('cobr') || t.includes('tarifa') || t.includes('ingreso') || t.includes('precio'))
    return 'abstract financial flow visualization, geometric currency symbols dissolving into data streams on deep dark';
  if (t.includes('docker') || t.includes('container') || t.includes('kubernetes'))
    return 'abstract container orchestration diagram, stacked geometric boxes with connection pipes, industrial dark aesthetic';
  if (t.includes('git') || t.includes('github') || t.includes('version'))
    return 'abstract git branching visualization, diverging and merging flow lines on dark background, version control art';

  // Slide type fallbacks
  if (type === 'hook')
    return `dramatic abstract visualization of the concept "${titulo}", striking geometric focal point with electric energy, dark editorial tech art`;
  if (type === 'cta')
    return 'warm radiating energy from center, invitation and connection, electric glow expanding outward on dark background';
  if (type === 'summary')
    return 'abstract crystalline structure suggesting clarity and synthesis, geometric completion aesthetic, dark premium editorial';

  return `abstract tech visualization for "${titulo}", dark editorial aesthetic, electric blue geometric pattern, Vercel/Linear dark style`;
}

// ── Single background for full carousel (legacy — kept for compatibility) ─────

export function buildBackgroundPrompt(topic: string, estructura?: Estructura): string {
  return buildSlideBackgroundPrompt(
    { number: 1, type: 'hook', titulo: topic, notaDiseno: 'abstract tech aesthetic' },
    topic,
    0,
    1,
  );
}
