import { NextRequest } from 'next/server';
import satori from 'satori';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { GenerateImagesRequestSchema } from '@/lib/crear-post/types';
import type { ProgressEvent } from '@/lib/crear-post/types';
import type { Archetype } from '@/lib/crear-post/constants';
import { generateBackground, buildProceduralBackground } from '@/lib/crear-post/nano-banana';
import { buildSlideBackgroundPrompt } from '@/lib/crear-post/brand-preset';
import {
  STRUCTURE_ARCHETYPES,
  DEFAULT_ARCHETYPES,
  PILAR_ACCENT_COLORS,
} from '@/lib/crear-post/constants';
import {
  HeroOverlay,
  HeroCTAOverlay,
  ListaOverlay,
  StatOverlay,
  QuoteOverlay,
  CodigoOverlay,
  VersusOverlay,
} from '@/lib/crear-post/satori-overlays';
import React from 'react';

export const runtime = 'nodejs';
export const maxDuration = 120;

// ── Font loading ─────────────────────────────────────────────────────────────
// ⚠️  Satori's bundled fontkit rejects WOFF2 ("Unsupported OpenType signature wOF2").
//     fontkit can handle WOFF (v1) and TTF/OTF but NOT WOFF2 (requires brotli).
//
// Strategy cascade:
//   1. Disk cache (.satori-fonts/) — instant on warm containers
//   2. jsDelivr @fontsource/outfit WOFF  — reliable, correct format
//   3. jsDelivr @fontsource/inter WOFF   — different face, always available
//   4. Bunny.net WOFF                    — privacy-friendly mirror
//
// WOFF URLs (jsDelivr @fontsource v4/v5 uses .woff files, NOT .woff2):
//   https://cdn.jsdelivr.net/npm/@fontsource/outfit@5/files/outfit-latin-400-normal.woff
//   https://cdn.jsdelivr.net/npm/@fontsource/outfit@5/files/outfit-latin-700-normal.woff

let outfitFont: ArrayBuffer | null = null;
let outfitFontBold: ArrayBuffer | null = null;

// Disk cache directory — writable in serverless (tmp or project root on Node)
const CACHE_DIR = path.join(process.cwd(), '.satori-fonts');
const CACHE_REG  = path.join(CACHE_DIR, 'outfit-400.woff');
const CACHE_BOLD = path.join(CACHE_DIR, 'outfit-700.woff');

async function fetchBuf(url: string): Promise<ArrayBuffer> {
  const r = await fetch(url, { next: { revalidate: 0 } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.arrayBuffer();
}

function tryReadCache(): boolean {
  try {
    if (fs.existsSync(CACHE_REG) && fs.existsSync(CACHE_BOLD)) {
      const reg  = fs.readFileSync(CACHE_REG);
      const bold = fs.readFileSync(CACHE_BOLD);
      outfitFont     = reg.buffer.slice(reg.byteOffset, reg.byteOffset + reg.byteLength);
      outfitFontBold = bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength);
      return true;
    }
  } catch { /* cache miss or unreadable */ }
  return false;
}

function writeCacheAsync(reg: ArrayBuffer, bold: ArrayBuffer) {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_REG,  Buffer.from(reg));
    fs.writeFileSync(CACHE_BOLD, Buffer.from(bold));
  } catch { /* non-fatal — next request will re-download */ }
}

async function loadFonts(): Promise<boolean> {
  // In-memory cache (same container, multiple requests)
  if (outfitFont && outfitFontBold) return true;

  // Disk cache (survives container restarts on persistent hosts)
  if (tryReadCache()) return true;

  // ── Strategy 1: jsDelivr @fontsource/outfit v5 WOFF ─────────────────────
  try {
    const [reg, bold] = await Promise.all([
      fetchBuf('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5/files/outfit-latin-400-normal.woff'),
      fetchBuf('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5/files/outfit-latin-700-normal.woff'),
    ]);
    outfitFont = reg;
    outfitFontBold = bold;
    writeCacheAsync(reg, bold);
    return true;
  } catch { /* fall through */ }

  // ── Strategy 2: jsDelivr @fontsource/outfit v4 WOFF (older but stable) ──
  try {
    const [reg, bold] = await Promise.all([
      fetchBuf('https://cdn.jsdelivr.net/npm/@fontsource/outfit@4.5.14/files/outfit-latin-400-normal.woff'),
      fetchBuf('https://cdn.jsdelivr.net/npm/@fontsource/outfit@4.5.14/files/outfit-latin-700-normal.woff'),
    ]);
    outfitFont = reg;
    outfitFontBold = bold;
    writeCacheAsync(reg, bold);
    return true;
  } catch { /* fall through */ }

  // ── Strategy 3: jsDelivr @fontsource/inter WOFF (different face fallback) ─
  try {
    const [reg, bold] = await Promise.all([
      fetchBuf('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-400-normal.woff'),
      fetchBuf('https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-700-normal.woff'),
    ]);
    outfitFont = reg;
    outfitFontBold = bold;
    writeCacheAsync(reg, bold);
    return true;
  } catch { /* fall through */ }

  // ── Strategy 4: Bunny.net WOFF ───────────────────────────────────────────
  try {
    const [reg, bold] = await Promise.all([
      fetchBuf('https://fonts.bunny.net/outfit/files/outfit-latin-400-normal.woff'),
      fetchBuf('https://fonts.bunny.net/outfit/files/outfit-latin-700-normal.woff'),
    ]);
    outfitFont = reg;
    outfitFontBold = bold;
    writeCacheAsync(reg, bold);
    return true;
  } catch { /* all strategies failed */ }

  return false;
}

const ARCHETYPE_MAP: Record<Archetype, React.ComponentType<Parameters<typeof HeroOverlay>[0]>> = {
  Hero: HeroOverlay,
  HeroCTA: HeroCTAOverlay,
  Lista: ListaOverlay,
  Stat: StatOverlay,
  Quote: QuoteOverlay,
  Codigo: CodigoOverlay,
  Versus: VersusOverlay,
};

function sendEvent(controller: ReadableStreamDefaultController, event: ProgressEvent) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  controller.enqueue(new TextEncoder().encode(data));
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = GenerateImagesRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Datos inválidos', details: parsed.error.flatten() }),
      { status: 400 }
    );
  }

  const input = parsed.data;
  const { draft, postType, pilar, estructura, resolution, mode } = input;

  const stream = new ReadableStream({
    async start(controller) {
      let totalCostUsd = 0;
      const imageUrls: string[] = [];

      try {
        sendEvent(controller, { type: 'background_started' });

        // ════════════════════════════════════════════════════════════════
        // POST ÚNICO — Imagen generates the complete image (no Satori)
        // Claude wrote a full design prompt in slide.imagenPrompt
        // ════════════════════════════════════════════════════════════════
        if (postType === 'post_unico') {
          const slide = draft.slides[0];
          const imagenPrompt = slide?.imagenPrompt;

          if (!imagenPrompt) {
            sendEvent(controller, { type: 'job_aborted', reason: 'El post único no tiene imagenPrompt. Regenerá el copy.' });
            controller.close();
            return;
          }

          sendEvent(controller, { type: 'slide_started', slide: 1, archetype: 'Hero' });

          let bgResult;
          try {
            bgResult = await generateBackground({
              prompt: imagenPrompt,
              resolution,
              mode,
              aspectRatio: '1:1', // Square for single Instagram post
            });
          } catch (err) {
            // Imagen failed — for post_unico there is no fallback (the whole image IS the Imagen output).
            // Abort with a clear message so the user knows what happened.
            const msg = err instanceof Error ? err.message : String(err);
            sendEvent(controller, {
              type: 'job_aborted',
              reason: `Google Imagen no pudo generar la imagen: ${msg}. Verificá los créditos en Google AI Studio (aistudio.google.com) e intentá de nuevo.`,
            });
            controller.close();
            return;
          }

          try {
            totalCostUsd += bgResult.costUsd;

            // base64 → Uint8Array — Imagen returns JPEG/PNG directly, no resvg needed
            const rawBuffer = Buffer.from(bgResult.base64!, 'base64');
            const pngData = new Uint8Array(rawBuffer);
            const mimeType = bgResult.url.split(';')[0].replace('data:', '') || 'image/jpeg';
            const ext = mimeType.includes('png') ? 'png' : 'jpg';

            const fileName = `${input.jobId}/slide-01.${ext}`;
            const { error: uploadError } = await supabase.storage
              .from('posts')
              .upload(fileName, pngData, { contentType: mimeType, upsert: true });

            if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);

            const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(fileName);
            imageUrls.push(publicUrl);

            sendEvent(controller, { type: 'slide_done', slide: 1, imageUrl: publicUrl, elapsedMs: 0 });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            sendEvent(controller, {
              type: 'job_aborted',
              reason: `Error procesando la imagen generada: ${msg}`,
            });
            controller.close();
            return;
          }

          // Save + done
          try {
            await supabase.from('generation_jobs').upsert({
              id: input.jobId, post_type: 'post_unico', pilar,
              idea: draft.title, publico: 'mixto', objetivo: 'guardados',
              variant_chosen: draft.variantLabel, draft_full: draft,
              images: imageUrls.filter(Boolean), total_cost_usd: totalCostUsd,
              status: imageUrls[0] ? 'done' : 'failed', user_id: (await supabase.auth.getUser()).data.user?.id,
            });
          } catch { /* non-fatal */ }

          sendEvent(controller, {
            type: 'job_done', totalCostUsd, imageUrls,
            status: imageUrls[0] ? 'done' : 'partial',
          });
          controller.close();
          return;
        }

        // ════════════════════════════════════════════════════════════════
        // CARRUSEL / STORY / ANUNCIO — Satori + per-slide Imagen backgrounds
        // ════════════════════════════════════════════════════════════════

        // Fonts are only needed for Satori (not post_unico)
        const fontsLoaded = await loadFonts();
        if (!fontsLoaded || !outfitFont || !outfitFontBold) {
          sendEvent(controller, {
            type: 'job_aborted',
            reason: 'No se pudieron cargar las fuentes tipográficas. Verificá tu conexión a internet e intentá de nuevo.',
          });
          controller.close();
          return;
        }
        const fonts = [
          { name: 'Outfit', data: outfitFont, weight: 400 as const, style: 'normal' as const },
          { name: 'Outfit', data: outfitFontBold, weight: 700 as const, style: 'normal' as const },
        ];

        const archetypeSequence = estructura
          ? STRUCTURE_ARCHETYPES[estructura]
          : DEFAULT_ARCHETYPES;

        const acentoColor = PILAR_ACCENT_COLORS[pilar];
        const totalSlides = draft.slides.length;

        for (let i = 0; i < totalSlides; i++) {
          const slide = draft.slides[i];
          const archetypeKey = archetypeSequence[Math.min(i, archetypeSequence.length - 1)] as Archetype;
          const OverlayComponent = ARCHETYPE_MAP[archetypeKey];
          const slideStart = Date.now();

          sendEvent(controller, { type: 'slide_started', slide: i + 1, archetype: archetypeKey });

          // ── Generate unique background for this slide ──────────────────
          // Try Imagen first for a real AI-generated image; fall back to
          // rich procedural SVG (unique pattern per slide index + accent color)
          let slideBackgroundUrl: string = buildProceduralBackground(i, acentoColor);
          try {
            const slidePrompt = buildSlideBackgroundPrompt(slide, draft.title, i, totalSlides);
            const bgResult = await generateBackground({ prompt: slidePrompt, resolution, mode });
            slideBackgroundUrl = bgResult.url;
            totalCostUsd += bgResult.costUsd;
          } catch {
            // Imagen failed (quota, network, etc.) — procedural fallback already set above
          }

          try {
            // Render SVG with Satori
            const svg = await satori(
              React.createElement(OverlayComponent, {
                slide,
                backgroundUrl: slideBackgroundUrl,
                acentoColor,
                firma: '@GaloDevCR',
                slideNumber: i + 1,
                totalSlides,
              }),
              { width: 1080, height: 1350, fonts }
            );

            // SVG → PNG via resvg
            let pngData: Uint8Array;
            try {
              const { Resvg } = await import('@resvg/resvg-js');
              pngData = new Resvg(svg, { fitTo: { mode: 'original' } }).render().asPng();
            } catch (resvgErr) {
              // resvg failed — store SVG as fallback (won't be a PNG but won't abort)
              throw new Error(`resvg failed: ${resvgErr instanceof Error ? resvgErr.message : String(resvgErr)}`);
            }

            // Upload PNG to Supabase Storage
            const fileName = `${input.jobId}/slide-${String(i + 1).padStart(2, '0')}.png`;
            const { error: uploadError } = await supabase.storage
              .from('posts')
              .upload(fileName, pngData, { contentType: 'image/png', upsert: true });

            if (uploadError) {
              throw new Error(`Supabase upload error: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(fileName);
            imageUrls.push(publicUrl);

            sendEvent(controller, {
              type: 'slide_done',
              slide: i + 1,
              imageUrl: publicUrl,
              elapsedMs: Date.now() - slideStart,
            });
          } catch (slideErr) {
            // Non-fatal: log and continue
            const errMsg = slideErr instanceof Error ? slideErr.message : String(slideErr);
            sendEvent(controller, {
              type: 'slide_failed',
              slide: i + 1,
              error: errMsg,
              willRetry: false,
            });
            imageUrls.push('');
          }
        }

        // ── Save to Supabase (non-fatal) ─────────────────────────────────
        try {
          const hasPartialFailures = imageUrls.some(u => !u);
          await supabase.from('generation_jobs').upsert({
            id: input.jobId,
            post_type: 'carrusel',
            pilar,
            estructura: estructura ?? null,
            idea: draft.title,
            publico: 'mixto',
            objetivo: 'guardados',
            variant_chosen: draft.variantLabel,
            draft_full: draft,
            images: imageUrls.filter(Boolean),
            total_cost_usd: totalCostUsd,
            status: hasPartialFailures ? 'partial' : 'done',
            user_id: user.id,
          });
        } catch {
          // Supabase save failed (table might not exist yet) — not fatal, images already generated
        }

        // ── Always send job_done ─────────────────────────────────────────
        const hasPartialFailures = imageUrls.some(u => !u);
        sendEvent(controller, {
          type: 'job_done',
          totalCostUsd,
          imageUrls,
          status: hasPartialFailures ? 'partial' : 'done',
        });

      } catch (fatalErr) {
        // Only truly unexpected errors reach here
        sendEvent(controller, {
          type: 'job_aborted',
          reason: fatalErr instanceof Error ? fatalErr.message : String(fatalErr),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
