// Satori text overlay components — fully redesigned for maximum visual impact.
// Satori supports only flexbox + a subset of CSS. No grid, no backdrop-filter.
// CRITICAL: Every <div> with 2+ children MUST have display: flex.
// Text with embedded expressions → always use template literals: {`${a}/${b}`}

import React from 'react';
import type { Slide } from './types';

export interface OverlayProps {
  slide: Slide;
  backgroundUrl: string;
  acentoColor: string;
  firma?: string;
  slideNumber: number;
  totalSlides: number;
}

const BD = 700;
const SM = 600;
const RG = 400;

// Strip leading bullet/dash characters from list items
function cleanItem(s: string) {
  return s.replace(/^[•\-\*→·▶]\s*/, '').trim();
}

// Parse cuerpo as list items (split by newline)
function parseItems(cuerpo?: string): string[] {
  if (!cuerpo) return [];
  return cuerpo.split('\n').map(cleanItem).filter(Boolean);
}

// ── SlideBase ─────────────────────────────────────────────────────────────────
// Dark background + bg image at low opacity + footer bar

function SlideBase({
  backgroundUrl,
  acentoColor,
  slideNumber,
  totalSlides,
  children,
}: OverlayProps & { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Outfit, sans-serif',
        background: '#020617',
        overflow: 'hidden',
      }}
    >
      {/* Background image (procedural or AI-generated) at low opacity */}
      {backgroundUrl && (
        <img
          src={backgroundUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1080,
            height: 1350,
            objectFit: 'cover',
            opacity: 0.22,
          }}
        />
      )}

      {children}

      {/* Footer: slide counter + handle */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 56px',
          background: 'linear-gradient(to top, rgba(2,6,23,0.98) 0%, transparent 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 13,
            fontWeight: RG,
            color: 'rgba(255,255,255,0.18)',
            letterSpacing: '0.1em',
          }}
        >
          {`${slideNumber} · ${totalSlides}`}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            fontWeight: SM,
            color: acentoColor,
            opacity: 0.65,
            letterSpacing: '0.06em',
          }}
        >
          @GaloDevCR
        </div>
      </div>
    </div>
  );
}

// ── Hero (Hook slide) ─────────────────────────────────────────────────────────
// Design: massive headline bottom-anchored, large accent orb top-right, galodev badge

export function HeroOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;

  return (
    <SlideBase {...props}>
      {/* Large glow orb — top right */}
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -180,
          width: 780,
          height: 780,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${acentoColor}28 0%, ${acentoColor}08 50%, transparent 70%)`,
        }}
      />

      {/* Secondary orb — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: -100,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${acentoColor}18 0%, transparent 65%)`,
        }}
      />

      {/* Top horizontal accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(to right, transparent 0%, ${acentoColor} 30%, ${acentoColor} 70%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      {/* GaloDev badge — top left */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: acentoColor,
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 12,
            fontWeight: BD,
            color: acentoColor,
            letterSpacing: '0.22em',
          }}
        >
          GALODEV.CR
        </div>
      </div>

      {/* Main content — bottom-anchored */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 72px 80px',
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 60,
            height: 5,
            background: acentoColor,
            borderRadius: 3,
            marginBottom: 32,
          }}
        />

        {/* Headline */}
        <div
          style={{
            fontSize: 76,
            fontWeight: BD,
            color: '#FFFFFF',
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            marginBottom: 28,
          }}
        >
          {slide.titulo}
        </div>

        {/* Subtitle */}
        {slide.subtitulo && (
          <div
            style={{
              fontSize: 26,
              fontWeight: RG,
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.45,
            }}
          >
            {slide.subtitulo}
          </div>
        )}
      </div>
    </SlideBase>
  );
}

// ── HeroCTA (Last slide — Save & DM) ─────────────────────────────────────────
// Design: centered, bold save prompt, CTA button visual

export function HeroCTAOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;

  return (
    <SlideBase {...props}>
      {/* Full-slide gradient tint */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(145deg, rgba(2,6,23,0) 0%, ${acentoColor}12 100%)`,
        }}
      />

      {/* Big orb — centered behind text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 700,
          height: 700,
          marginTop: -350,
          marginLeft: -350,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${acentoColor}20 0%, transparent 65%)`,
        }}
      />

      {/* Content — centered */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        {/* Icon ring (save / bookmark) */}
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: `${acentoColor}20`,
            border: `2px solid ${acentoColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 44,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: BD,
              color: acentoColor,
              lineHeight: 1,
              display: 'flex',
            }}
          >
            ↓
          </div>
        </div>

        {/* Main CTA text */}
        <div
          style={{
            fontSize: 62,
            fontWeight: BD,
            color: '#FFFFFF',
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          {slide.titulo}
        </div>

        {/* Subtitle */}
        {slide.subtitulo && (
          <div
            style={{
              fontSize: 23,
              fontWeight: RG,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.5,
              textAlign: 'center',
              marginBottom: 48,
            }}
          >
            {slide.subtitulo}
          </div>
        )}

        {/* CTA button visual */}
        <div
          style={{
            background: acentoColor,
            borderRadius: 20,
            padding: '20px 52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 21,
              fontWeight: BD,
              color: '#020617',
              letterSpacing: '0.01em',
            }}
          >
            {slide.cuerpo || 'Guardá este post ↓'}
          </div>
        </div>
      </div>
    </SlideBase>
  );
}

// ── Lista (numbered list) ─────────────────────────────────────────────────────
// Design: glass cards with accent number badges, vertical bar on title

export function ListaOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;
  const items = parseItems(slide.cuerpo);

  return (
    <SlideBase {...props}>
      {/* Accent orb — top right */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${acentoColor}18 0%, transparent 65%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 72px 32px',
        }}
      >
        {/* Title with vertical accent bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              width: 5,
              height: 52,
              background: acentoColor,
              borderRadius: 3,
              flexShrink: 0,
              marginTop: 6,
            }}
          />
          <div
            style={{
              fontSize: 46,
              fontWeight: BD,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-0.015em',
            }}
          >
            {slide.titulo}
          </div>
        </div>

        {/* List items */}
        {items.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.slice(0, 6).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${acentoColor}25`,
                  borderRadius: 16,
                  padding: '18px 24px',
                }}
              >
                {/* Number badge */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `${acentoColor}22`,
                    border: `1px solid ${acentoColor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 17,
                    fontWeight: BD,
                    color: acentoColor,
                  }}
                >
                  {`${i + 1}`}
                </div>
                {/* Text */}
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: RG,
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 27,
              fontWeight: RG,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
            }}
          >
            {slide.subtitulo || slide.cuerpo}
          </div>
        )}
      </div>
    </SlideBase>
  );
}

// ── Stat (impact numbers / data) ──────────────────────────────────────────────
// Design: giant centered stat, decorative lines, context below

export function StatOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;

  return (
    <SlideBase {...props}>
      {/* Full background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(160deg, #020617 0%, ${acentoColor}10 100%)`,
        }}
      />

      {/* Decorative top line */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 72,
          right: 72,
          height: 1,
          background: `linear-gradient(to right, transparent, ${acentoColor}50, transparent)`,
        }}
      />

      {/* Decorative bottom line */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 72,
          right: 72,
          height: 1,
          background: `linear-gradient(to right, transparent, ${acentoColor}50, transparent)`,
        }}
      />

      {/* Main content — centered */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        {/* Giant stat / title */}
        <div
          style={{
            fontSize: 108,
            fontWeight: BD,
            color: acentoColor,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          {slide.titulo}
        </div>

        {/* Accent divider */}
        <div
          style={{
            width: 48,
            height: 4,
            background: acentoColor,
            borderRadius: 2,
            marginBottom: 28,
            opacity: 0.6,
          }}
        />

        {/* Subtitle */}
        {slide.subtitulo && (
          <div
            style={{
              fontSize: 30,
              fontWeight: SM,
              color: '#FFFFFF',
              lineHeight: 1.3,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            {slide.subtitulo}
          </div>
        )}

        {/* Body */}
        {slide.cuerpo && (
          <div
            style={{
              fontSize: 21,
              fontWeight: RG,
              color: 'rgba(255,255,255,0.38)',
              lineHeight: 1.55,
              textAlign: 'center',
              maxWidth: 720,
            }}
          >
            {slide.cuerpo}
          </div>
        )}
      </div>
    </SlideBase>
  );
}

// ── Quote ─────────────────────────────────────────────────────────────────────
// Design: large decorative quote mark, centered quote text, subtle attribution

export function QuoteOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;

  return (
    <SlideBase {...props}>
      {/* Subtle background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${acentoColor}12 0%, transparent 65%)`,
        }}
      />

      {/* Decorative large quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          fontSize: 200,
          fontWeight: BD,
          color: acentoColor,
          lineHeight: 1,
          opacity: 0.12,
        }}
      >
        {'"'}
      </div>

      {/* Content — vertically centered */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
        }}
      >
        {/* Quote text */}
        <div
          style={{
            fontSize: 44,
            fontWeight: SM,
            color: '#FFFFFF',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            marginBottom: 40,
          }}
        >
          {slide.titulo}
        </div>

        {/* Attribution / context */}
        {slide.cuerpo && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              style={{
                width: 40,
                height: 2,
                background: acentoColor,
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 20,
                fontWeight: RG,
                color: 'rgba(255,255,255,0.42)',
                lineHeight: 1.5,
              }}
            >
              {slide.cuerpo}
            </div>
          </div>
        )}

        {/* Subtitle as extra context */}
        {slide.subtitulo && (
          <div
            style={{
              fontSize: 22,
              fontWeight: RG,
              color: 'rgba(255,255,255,0.32)',
              lineHeight: 1.5,
              marginTop: 20,
            }}
          >
            {slide.subtitulo}
          </div>
        )}
      </div>
    </SlideBase>
  );
}

// ── Codigo (code / technical deep-dive) ───────────────────────────────────────
// Design: terminal window when snippet exists, themed list otherwise

export function CodigoOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;
  const items = parseItems(slide.cuerpo);
  const hasSnippet = !!slide.snippet;

  return (
    <SlideBase {...props}>
      {/* Subtle tint */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(3,9,30,0.5) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 64px 32px',
        }}
      >
        {/* Accent bar + title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 5,
              height: 48,
              background: acentoColor,
              borderRadius: 3,
              flexShrink: 0,
              marginTop: 4,
            }}
          />
          <div
            style={{
              fontSize: 42,
              fontWeight: BD,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
            }}
          >
            {slide.titulo}
          </div>
        </div>

        {hasSnippet ? (
          /* ── Terminal window ── */
          <div
            style={{
              background: 'rgba(8,16,40,0.95)',
              border: `1px solid ${acentoColor}30`,
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {/* Traffic lights */}
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: c,
                  }}
                />
              ))}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: RG,
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.05em',
                  }}
                >
                  código
                </div>
              </div>
            </div>
            {/* Code area */}
            <div
              style={{
                padding: '28px 32px',
                fontSize: 18,
                fontWeight: RG,
                color: '#7dd3fc',
                lineHeight: 1.7,
                letterSpacing: '0.01em',
                display: 'flex',
              }}
            >
              {slide.snippet}
            </div>
          </div>
        ) : items.length > 0 ? (
          /* ── List fallback ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.slice(0, 5).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  background: `${acentoColor}0C`,
                  border: `1px solid ${acentoColor}25`,
                  borderRadius: 14,
                  padding: '16px 22px',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${acentoColor}22`,
                    border: `1px solid ${acentoColor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                    fontWeight: BD,
                    color: acentoColor,
                  }}
                >
                  {`${i + 1}`}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: RG,
                    color: 'rgba(255,255,255,0.78)',
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Prose fallback ── */
          <div
            style={{
              fontSize: 26,
              fontWeight: RG,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
            }}
          >
            {slide.subtitulo || slide.cuerpo}
          </div>
        )}
      </div>
    </SlideBase>
  );
}

// ── Versus (comparison / two sides) ──────────────────────────────────────────
// Design: two-column when `|||` separator found; themed list otherwise

export function VersusOverlay(props: OverlayProps) {
  const { slide, acentoColor } = props;

  const hasSplit = slide.cuerpo?.includes('|||');
  const parts = hasSplit ? (slide.cuerpo?.split('|||') ?? []) : [];
  const leftText = parts[0]?.trim() ?? '';
  const rightText = parts[1]?.trim() ?? '';

  const items = hasSplit ? [] : parseItems(slide.cuerpo);

  return (
    <SlideBase {...props}>
      {/* Accent orb top-right */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${acentoColor}15 0%, transparent 65%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 64px 32px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 44,
            fontWeight: BD,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            marginBottom: 40,
          }}
        >
          {slide.titulo}
        </div>

        {hasSplit ? (
          /* ── Two-column layout ── */
          <div style={{ display: 'flex', gap: 20, flex: 1 }}>
            {/* Left (negative) */}
            <div
              style={{
                flex: 1,
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: BD,
                    color: '#f87171',
                  }}
                >
                  ✗
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: BD,
                    color: '#f87171',
                    letterSpacing: '0.15em',
                  }}
                >
                  SIN ESTO
                </div>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: RG,
                  color: 'rgba(255,255,255,0.58)',
                  lineHeight: 1.55,
                }}
              >
                {leftText || slide.subtitulo}
              </div>
            </div>

            {/* Right (positive) */}
            <div
              style={{
                flex: 1,
                background: `${acentoColor}0E`,
                border: `1px solid ${acentoColor}35`,
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: `${acentoColor}25`,
                    border: `1px solid ${acentoColor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: BD,
                    color: acentoColor,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: BD,
                    color: acentoColor,
                    letterSpacing: '0.15em',
                  }}
                >
                  CON ESTO
                </div>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: RG,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.55,
                }}
              >
                {rightText}
              </div>
            </div>
          </div>
        ) : items.length > 0 ? (
          /* ── List fallback ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.slice(0, 5).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${acentoColor}22`,
                  borderRadius: 16,
                  padding: '18px 24px',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${acentoColor}20`,
                    border: `1px solid ${acentoColor}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                    fontWeight: BD,
                    color: acentoColor,
                  }}
                >
                  {`${i + 1}`}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: RG,
                    color: 'rgba(255,255,255,0.78)',
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Prose fallback ── */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {slide.subtitulo && (
              <div
                style={{
                  fontSize: 26,
                  fontWeight: SM,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.45,
                }}
              >
                {slide.subtitulo}
              </div>
            )}
            {slide.cuerpo && (
              <div
                style={{
                  fontSize: 22,
                  fontWeight: RG,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.6,
                }}
              >
                {slide.cuerpo}
              </div>
            )}
          </div>
        )}
      </div>
    </SlideBase>
  );
}

// ── Archetype map (for route.ts) ──────────────────────────────────────────────

export const ARCHETYPE_COMPONENTS = {
  Hero: HeroOverlay,
  HeroCTA: HeroCTAOverlay,
  Lista: ListaOverlay,
  Stat: StatOverlay,
  Quote: QuoteOverlay,
  Codigo: CodigoOverlay,
  Versus: VersusOverlay,
} as const;
