import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { GenerateCopyRequestSchema, CopyDraftPairSchema } from '@/lib/crear-post/types';
import { buildCopyPrompt, buildPostUnicoPrompt } from '@/lib/crear-post/claude-prompt';

// Increase limit to 60 s — Claude can take 20-30 s on long prompts
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VOSEO_REGEX = /\b(tienes|sabes|puedes|quieres|debes|eres|haces|vas|llevas|tienes que|deberías)\b/gi;

const VALID_SLIDE_TYPES = ['hook', 'roadmap', 'body', 'summary', 'cta'] as const;

// ── Sanitize Claude's raw output before Zod validation ─────────────────────
// Claude occasionally returns null for optional fields or wrong slide types.
// This function coerces everything into the expected shape so Zod passes.
function sanitizeVariant(raw: Record<string, unknown>, label: 'A' | 'B'): unknown {
  const rawSlides: unknown[] = Array.isArray(raw.slides) ? raw.slides : [];
  const total = rawSlides.length;

  const slides = rawSlides.map((s: unknown, i: number) => {
    const slide = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>;

    // Infer type from position if missing or invalid
    let type = slide.type;
    if (!VALID_SLIDE_TYPES.includes(type as typeof VALID_SLIDE_TYPES[number])) {
      if (i === 0) type = 'hook';
      else if (i === total - 1) type = 'cta';
      else type = 'body';
    }

    return {
      number: typeof slide.number === 'number' ? slide.number : i + 1,
      type,
      titulo: slide.titulo != null ? String(slide.titulo) : '',
      subtitulo: slide.subtitulo != null ? String(slide.subtitulo) : undefined,
      cuerpo: slide.cuerpo != null ? String(slide.cuerpo) : undefined,
      snippet: slide.snippet != null ? String(slide.snippet) : undefined,
      notaDiseno:
        slide.notaDiseno != null
          ? String(slide.notaDiseno)
          : 'abstract dark tech background, glowing particles',
    };
  });

  return {
    variantLabel: label,
    approach: raw.approach != null ? String(raw.approach) : '',
    title: raw.title != null ? String(raw.title) : '',
    slides,
    caption: raw.caption != null ? String(raw.caption) : '',
    hashtags: (Array.isArray(raw.hashtags) ? raw.hashtags : [])
      .map(String)
      .filter(Boolean)
      .slice(0, 10), // cap at 10
    cta: raw.cta != null ? String(raw.cta) : '',
    hookAlternativo: raw.hookAlternativo != null ? String(raw.hookAlternativo) : '',
  };
}

// ── Route ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Validate input
  const body = await req.json().catch(() => null);
  const parsed = GenerateCopyRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const isPostUnico = input.postType === 'post_unico';

  // Build prompt — post_unico uses a separate, specialized prompt
  const prompt = isPostUnico ? buildPostUnicoPrompt(input) : buildCopyPrompt(input);

  // Call Claude with retry logic
  let attempt = 0;
  const MAX_ATTEMPTS = 3;
  let lastError: string | null = null;

  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      });

      const rawText = message.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as { type: 'text'; text: string }).text)
        .join('');

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in Claude response');

      const rawJson = JSON.parse(jsonMatch[0]);

      // ── Post Único: single variant path ──────────────────────────────
      if (isPostUnico) {
        const rawVariant = (rawJson.variant ?? rawJson.variants?.[0] ?? rawJson) as Record<string, unknown>;
        const sanitized = sanitizeVariant(rawVariant, 'A');

        // Preserve imagenPrompt from the slide (not sanitized away)
        const rawSlides = Array.isArray(rawVariant.slides) ? rawVariant.slides : [];
        const sanitizedAny = sanitized as Record<string, unknown>;
        const sanitizedSlides = Array.isArray(sanitizedAny.slides) ? sanitizedAny.slides as Record<string, unknown>[] : [];
        sanitizedSlides.forEach((slide, i) => {
          const rawSlide = (rawSlides[i] ?? {}) as Record<string, unknown>;
          if (rawSlide.imagenPrompt != null) {
            slide.imagenPrompt = String(rawSlide.imagenPrompt);
          }
        });

        const pairValidation = CopyDraftPairSchema.safeParse({
          draftId: crypto.randomUUID(),
          model: 'claude-sonnet-4-5',
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
          costUsd: calculateCost(message.usage.input_tokens, message.usage.output_tokens),
          generatedAt: new Date().toISOString(),
          variants: [sanitized, sanitized], // same draft twice — frontend auto-selects
        });

        if (!pairValidation.success) {
          lastError = `Zod validation failed: ${JSON.stringify(pairValidation.error.flatten())}`;
          continue;
        }

        return NextResponse.json({ success: true, data: pairValidation.data, postUnico: true });
      }

      // ── Carrusel / story / anuncio: two-variant path ─────────────────
      const variants: unknown[] = rawJson.variants ?? [];
      if (variants.length < 2) throw new Error('Claude returned fewer than 2 variants');

      const sanitizedA = sanitizeVariant(variants[0] as Record<string, unknown>, 'A');
      const sanitizedB = sanitizeVariant(variants[1] as Record<string, unknown>, 'B');

      const pairValidation = CopyDraftPairSchema.safeParse({
        draftId: crypto.randomUUID(),
        model: 'claude-sonnet-4-5',
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        costUsd: calculateCost(message.usage.input_tokens, message.usage.output_tokens),
        generatedAt: new Date().toISOString(),
        variants: [sanitizedA, sanitizedB],
      });

      if (!pairValidation.success) {
        lastError = `Zod validation failed: ${JSON.stringify(pairValidation.error.flatten())}`;
        continue;
      }

      const result = pairValidation.data;

      const fullText = JSON.stringify(result);
      if (VOSEO_REGEX.test(fullText) && attempt < MAX_ATTEMPTS) {
        lastError = 'Voseo incorrecto detectado';
        continue;
      }

      return NextResponse.json({ success: true, data: result });
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt >= MAX_ATTEMPTS) break;
    }
  }

  return NextResponse.json(
    { error: 'No se pudo generar el copy', details: lastError },
    { status: 500 }
  );
}

function calculateCost(inputTokens: number, outputTokens: number): number {
  // claude-sonnet-4-5 pricing: $3/1M input, $15/1M output
  const cost = (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;
  return parseFloat(cost.toFixed(4));
}
