// Image generation client — Google AI Studio Imagen 3
// API key: GOOGLE_AI_API_KEY (Google AI Studio)
// Model: imagen-3.0-generate-002

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

const IMAGEN_COST_PER_IMAGE = 0.04;

export interface ImageGenOptions {
  prompt: string;
  resolution: '1K' | '2K';
  mode?: 'standard' | 'batch';
  aspectRatio?: '1:1' | '3:4' | '9:16';
}

export interface ImageGenResult {
  url: string;
  base64?: string;
  width: number;
  height: number;
  costUsd: number;
}

/**
 * Generate a background image using Google Imagen 3.
 * Returns a data URL that Satori can embed directly as the background.
 */
export async function generateBackground(options: ImageGenOptions): Promise<ImageGenResult> {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY not configured in .env.local');
  }

  // Map requested ratio to Imagen 3 supported ratios (1:1 | 3:4 | 4:3 | 9:16 | 16:9)
  const aspectRatio = options.aspectRatio === '1:1' ? '1:1' : '3:4';
  const isSquare = aspectRatio === '1:1';
  const width = options.resolution === '2K' ? 1080 : 768;
  const height = isSquare
    ? width
    : options.resolution === '2K' ? 1350 : 960;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GOOGLE_AI_API_KEY}`;

  const requestBody = {
    instances: [{ prompt: options.prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio,
      safetyFilterLevel: 'BLOCK_ONLY_HIGH',
      personGeneration: 'DONT_ALLOW',
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'unknown error');
    throw new Error(`Google Imagen error ${response.status}: ${errText}`);
  }

  const data = await response.json() as {
    predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>;
    error?: { message: string };
  };

  if (data.error) throw new Error(`Google Imagen API error: ${data.error.message}`);

  const prediction = data.predictions?.[0];
  if (!prediction?.bytesBase64Encoded) throw new Error('Google Imagen returned no image data');

  const base64 = prediction.bytesBase64Encoded;
  const mimeType = prediction.mimeType ?? 'image/png';

  return {
    url: `data:${mimeType};base64,${base64}`,
    base64,
    width,
    height,
    costUsd: IMAGEN_COST_PER_IMAGE,
  };
}

// ── Procedural backgrounds — 8 unique patterns, one per slide ─────────────────
//
// Each pattern is visually distinct and uses the pilar accent color.
// Designed to look great at 20% opacity over the dark slide content.

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

// ── Pattern 0: Radar rings + spokes (Hero/Hook slide) ────────────────────────
function patternRadar(c: string): string {
  const cx = 540, cy = 500;
  const rings = Array.from({ length: 7 }, (_, i) => {
    const r = 100 + i * 130;
    const op = (0.20 - i * 0.022).toFixed(3);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="0.9" opacity="${op}"/>`;
  });
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const rad = (i * 15) * Math.PI / 180;
    const x2 = (cx + 980 * Math.cos(rad)).toFixed(1);
    const y2 = (cy + 980 * Math.sin(rad)).toFixed(1);
    return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="0.5" opacity="0.06"/>`;
  });
  const center = `<circle cx="${cx}" cy="${cy}" r="8" fill="${c}" opacity="0.5"/><circle cx="${cx}" cy="${cy}" r="24" fill="${c}" opacity="0.08"/>`;
  return rings.join('') + spokes.join('') + center;
}

// ── Pattern 1: Diagonal flow lines with glowing nodes ────────────────────────
function patternDiagonal(c: string): string {
  const lines = Array.from({ length: 28 }, (_, i) => {
    const x = i * 75 - 300;
    const op = (0.05 + Math.abs(Math.sin(i * 0.9)) * 0.10).toFixed(3);
    const w = i % 5 === 0 ? 1.4 : 0.5;
    return `<line x1="${x}" y1="0" x2="${x + 1350}" y2="1350" stroke="${c}" stroke-width="${w}" opacity="${op}"/>`;
  });
  const nodes: [number, number][] = [
    [120, 300], [480, 200], [750, 520], [300, 780], [900, 380],
    [200, 1100], [660, 940], [820, 170], [540, 1180], [160, 640],
  ];
  const dots = nodes.flatMap(([x, y]) => [
    `<circle cx="${x}" cy="${y}" r="4" fill="${c}" opacity="0.5"/>`,
    `<circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${c}" stroke-width="1" opacity="0.18"/>`,
    `<circle cx="${x}" cy="${y}" r="28" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.07"/>`,
  ]);
  return lines.join('') + dots.join('');
}

// ── Pattern 2: Node network (scattered dots + connection lines) ───────────────
function patternNetwork(c: string): string {
  const nodes: [number, number][] = [
    [120, 180], [380, 120], [680, 200], [900, 160], [1020, 300],
    [200, 450], [540, 380], [820, 420], [980, 500], [100, 680],
    [380, 720], [660, 640], [900, 700], [1050, 780], [240, 950],
    [540, 880], [800, 960], [960, 1050], [140, 1150], [420, 1200],
    [700, 1150], [920, 1250], [320, 300], [760, 320], [480, 560],
  ];
  const edges: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0], dy = nodes[i][1] - nodes[j][1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 340) {
        const op = (0.18 * (1 - dist / 340)).toFixed(3);
        edges.push(`<line x1="${nodes[i][0]}" y1="${nodes[i][1]}" x2="${nodes[j][0]}" y2="${nodes[j][1]}" stroke="${c}" stroke-width="0.8" opacity="${op}"/>`);
      }
    }
  }
  const dots = nodes.flatMap(([x, y]) => [
    `<circle cx="${x}" cy="${y}" r="4" fill="${c}" opacity="0.55"/>`,
    `<circle cx="${x}" cy="${y}" r="10" fill="${c}" opacity="0.09"/>`,
  ]);
  return edges.join('') + dots.join('');
}

// ── Pattern 3: Isometric grid ─────────────────────────────────────────────────
function patternIsometric(c: string): string {
  const lines: string[] = [];
  const spacing = 88;
  // Lines going ↘
  for (let i = -8; i <= 22; i++) {
    const x = i * spacing;
    lines.push(`<line x1="${x - 700}" y1="${-700 * 0.577}" x2="${x + 700}" y2="${700 * 0.577}" stroke="${c}" stroke-width="0.65" opacity="0.08"/>`);
  }
  // Lines going ↙
  for (let i = -8; i <= 22; i++) {
    const x = i * spacing;
    lines.push(`<line x1="${1080 - x + 700}" y1="${-700 * 0.577}" x2="${1080 - x - 700}" y2="${700 * 0.577}" stroke="${c}" stroke-width="0.65" opacity="0.08"/>`);
  }
  // Horizontal lines
  for (let y = 0; y <= 1350; y += spacing * 0.866) {
    lines.push(`<line x1="0" y1="${y.toFixed(1)}" x2="1080" y2="${y.toFixed(1)}" stroke="${c}" stroke-width="0.4" opacity="0.04"/>`);
  }
  return lines.join('');
}

// ── Pattern 4: Horizontal data streams with pulse markers ────────────────────
function patternDataStream(c: string): string {
  const lines = Array.from({ length: 36 }, (_, i) => {
    const y = 20 + i * 38;
    const op = (0.04 + Math.abs(Math.sin(i * 0.7)) * 0.09).toFixed(3);
    const w = i % 6 === 0 ? 1.5 : 0.5;
    return `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="${c}" stroke-width="${w}" opacity="${op}"/>`;
  });
  const pulses: [number, number, number][] = [
    [80, 76, 45], [320, 190, 70], [600, 304, 35], [900, 418, 55],
    [180, 532, 80], [720, 646, 42], [420, 760, 62], [850, 874, 38],
    [240, 988, 50], [560, 1102, 72], [750, 1216, 44],
  ];
  const rects = pulses.map(([x, y, w]) =>
    `<rect x="${x}" y="${y - 3}" width="${w}" height="7" rx="3.5" fill="${c}" opacity="0.30"/>`
  );
  return lines.join('') + rects.join('');
}

// ── Pattern 5: Circuit board PCB traces ───────────────────────────────────────
function patternCircuit(c: string): string {
  const traces: string[] = [];
  // Horizontal traces
  const h: [number, number, number][] = [
    [0, 420, 200], [200, 660, 360], [380, 940, 500], [140, 750, 680],
    [320, 1080, 860], [80, 540, 1060], [460, 1080, 1180],
  ];
  for (const [x1, x2, y] of h) {
    traces.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${c}" stroke-width="1.3" opacity="0.14"/>`);
    traces.push(`<circle cx="${x1 + 1}" cy="${y}" r="4" fill="${c}" opacity="0.22"/>`);
    traces.push(`<circle cx="${x2 - 1}" cy="${y}" r="4" fill="${c}" opacity="0.22"/>`);
  }
  // Vertical connectors
  const v: [number, number, number][] = [
    [420, 200, 360], [660, 360, 500], [940, 500, 680],
    [750, 680, 860], [540, 860, 1060],
  ];
  for (const [x, y1, y2] of v) {
    traces.push(`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${c}" stroke-width="1.3" opacity="0.14"/>`);
  }
  // Via holes
  const vias: [number, number][] = [[420, 200], [660, 360], [940, 500], [750, 680], [540, 860], [80, 1060], [320, 1180]];
  for (const [x, y] of vias) {
    traces.push(`<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${c}" stroke-width="1.8" opacity="0.28"/>`);
    traces.push(`<circle cx="${x}" cy="${y}" r="3.5" fill="${c}" opacity="0.40"/>`);
  }
  return traces.join('');
}

// ── Pattern 6: Hexagonal grid ─────────────────────────────────────────────────
function patternHex(c: string): string {
  const hexes: string[] = [];
  const r = 68, h = r * Math.sqrt(3);
  for (let row = -1; row <= 13; row++) {
    for (let col = -1; col <= 10; col++) {
      const x = col * r * 1.5 + (row % 2 === 0 ? 0 : r * 0.75);
      const y = row * (h / 2);
      const op = (0.03 + Math.abs(Math.sin(row * 1.4 + col * 0.9)) * 0.08).toFixed(3);
      hexes.push(`<polygon points="${hexPoints(x, y, r - 5)}" fill="none" stroke="${c}" stroke-width="0.9" opacity="${op}"/>`);
    }
  }
  return hexes.join('');
}

// ── Pattern 7: Radial burst from center (CTA / closing slide) ────────────────
function patternRadialBurst(c: string): string {
  const cx = 540, cy = 620;
  const spokes = Array.from({ length: 48 }, (_, i) => {
    const rad = (i * 7.5) * Math.PI / 180;
    const r1 = 55 + (i % 4 === 0 ? 0 : 15);
    const r2 = 760 + (i % 8 === 0 ? 120 : 0);
    const op = (0.04 + (i % 6 === 0 ? 0.10 : 0)).toFixed(3);
    const w = i % 12 === 0 ? 1.3 : 0.5;
    const x1 = (cx + r1 * Math.cos(rad)).toFixed(1), y1 = (cy + r1 * Math.sin(rad)).toFixed(1);
    const x2 = (cx + r2 * Math.cos(rad)).toFixed(1), y2 = (cy + r2 * Math.sin(rad)).toFixed(1);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" opacity="${op}"/>`;
  });
  const rings = Array.from({ length: 6 }, (_, i) => {
    const r = 80 + i * 120;
    const op = (0.10 - i * 0.012).toFixed(3);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="0.9" opacity="${op}"/>`;
  });
  const core = [
    `<circle cx="${cx}" cy="${cy}" r="22" fill="${c}" opacity="0.18"/>`,
    `<circle cx="${cx}" cy="${cy}" r="7" fill="${c}" opacity="0.55"/>`,
  ];
  return spokes.join('') + rings.join('') + core.join('');
}

const PATTERNS = [
  patternRadar,       // 0 — Hero / hook
  patternDiagonal,    // 1 — Body 1
  patternNetwork,     // 2 — Body 2
  patternIsometric,   // 3 — Body 3
  patternDataStream,  // 4 — Body 4
  patternCircuit,     // 5 — Body 5
  patternHex,         // 6 — Quote / summary
  patternRadialBurst, // 7 — CTA / closing
];

/**
 * Build a unique, rich procedural SVG background for a specific slide.
 * Each slide index maps to a distinct visual pattern.
 * Uses the pilar accent color so the background feels on-brand.
 */
export function buildProceduralBackground(slideIndex: number, accentColor: string): string {
  const patternFn = PATTERNS[slideIndex % PATTERNS.length];
  const [r, g, b] = hexToRgb(accentColor);
  const rgb = `${r},${g},${b}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <radialGradient id="bg" cx="40%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#0d1829"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="g1" cx="72%" cy="18%" r="55%">
      <stop offset="0%" stop-color="rgb(${rgb})" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="18%" cy="82%" r="48%">
      <stop offset="0%" stop-color="rgb(${rgb})" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect width="1080" height="1350" fill="url(#g1)"/>
  <rect width="1080" height="1350" fill="url(#g2)"/>
  ${patternFn(accentColor)}
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
