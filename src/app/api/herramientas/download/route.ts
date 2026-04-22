import { NextResponse } from 'next/server';

/* ── TikTok via tikwm.com (free, no key) ─────────────────────── */

type TikwmResponse = {
  code: number;
  msg: string;
  data?: {
    id: string;
    title: string;
    cover: string;
    origin_cover: string;
    duration: number;
    play: string;
    wmplay: string;
    music: string;
    music_info: { title: string; author: string; cover: string };
    author: { id: string; unique_id: string; nickname: string; avatar: string };
  };
};

async function fetchTikTok(url: string) {
  const body = new URLSearchParams({ url, hd: '1' });
  const res = await fetch('https://www.tikwm.com/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
    body,
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error('tikwm_request_failed');

  const json: TikwmResponse = await res.json();
  if (json.code !== 0 || !json.data) throw new Error(json.msg || 'tikwm_error');

  const d = json.data;
  return {
    platform: 'tiktok' as const,
    title: d.title,
    thumbnail: d.origin_cover || d.cover,
    duration: d.duration,
    author: d.author.nickname,
    authorHandle: d.author.unique_id,
    authorAvatar: d.author.avatar,
    downloads: [
      { label: 'Sin marca de agua', url: d.play, type: 'video' as const },
      { label: 'Con marca de agua', url: d.wmplay, type: 'video' as const },
      { label: 'Solo audio (MP3)', url: d.music, type: 'audio' as const },
    ],
  };
}

/* ── Instagram via RapidAPI (instagram-looter2) ──────────────── */

async function fetchInstagramRapid(url: string) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('no_rapidapi_key');

  const endpoint =
    'https://instagram-looter2.p.rapidapi.com/media-link?' +
    new URLSearchParams({ link: url }).toString();

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'instagram-looter2.p.rapidapi.com',
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`rapidapi_http_${res.status}`);

  const json = await res.json();

  // instagram-looter2 returns: { data: { media: [{url, type}], thumbnail, caption, owner } }
  const media: Array<{ url: string; type: string }> =
    json?.data?.media ?? json?.media ?? [];

  if (!media.length) throw new Error('no_media_found');

  const videos = media.filter((m) => m.type === 'video');
  const primary = videos[0] ?? media[0];

  const caption: string = json?.data?.caption ?? json?.caption ?? 'Instagram Reel';
  const thumbnail: string | null = json?.data?.thumbnail ?? json?.thumbnail ?? null;
  const ownerName: string | null =
    json?.data?.owner?.username ?? json?.owner?.username ?? null;

  return {
    platform: 'instagram' as const,
    title: caption.slice(0, 120) || 'Instagram Reel',
    thumbnail,
    duration: null,
    author: ownerName,
    authorHandle: ownerName,
    authorAvatar: null,
    downloads: [
      { label: 'Descargar Reel', url: primary.url, type: 'video' as const },
    ],
  };
}

/* ── Instagram via cobalt.tools (fallback, works without key) ── */

async function fetchInstagramCobalt(url: string) {
  const res = await fetch('https://api.cobalt.tools/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
    body: JSON.stringify({ url, downloadMode: 'auto', videoQuality: 'max' }),
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`cobalt_http_${res.status}`);

  const json = await res.json();
  if (json.status === 'error') throw new Error(json.error?.code ?? 'cobalt_error');

  const downloadUrl: string | null = json.url ?? json.picker?.[0]?.url ?? null;
  if (!downloadUrl) throw new Error('cobalt_no_url');

  return {
    platform: 'instagram' as const,
    title: 'Instagram Reel',
    thumbnail: null,
    duration: null,
    author: null,
    authorHandle: null,
    authorAvatar: null,
    downloads: [{ label: 'Descargar Reel', url: downloadUrl, type: 'video' as const }],
  };
}

/* ── Instagram orchestrator: RapidAPI → cobalt fallback ─────── */

async function fetchInstagram(url: string) {
  // Primary: RapidAPI (reliable in production)
  try {
    return await fetchInstagramRapid(url);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    // Only fallback if it's NOT a key-missing error (would fail the same way)
    if (msg !== 'no_rapidapi_key') {
      try {
        return await fetchInstagramCobalt(url);
      } catch {
        // both failed — re-throw original RapidAPI error
      }
    }
    throw e;
  }
}

/* ── Route handler ───────────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url: unknown = body?.url;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    const clean = url.trim();

    if (clean.includes('tiktok.com') || clean.includes('vm.tiktok.com')) {
      const data = await fetchTikTok(clean);
      return NextResponse.json({ success: true, data });
    }

    if (clean.includes('instagram.com') || clean.includes('instagr.am')) {
      const data = await fetchInstagram(clean);
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { error: 'URL no soportada. Usa links de TikTok o Instagram Reels.' },
      { status: 400 },
    );
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'unknown';

    let friendly = 'No se pudo procesar el video. Verifica que el link sea válido y público.';

    if (raw === 'no_rapidapi_key') {
      friendly = 'Falta la clave de API. Configura RAPIDAPI_KEY en las variables de entorno.';
    } else if (raw.startsWith('rapidapi_http_403') || raw.startsWith('rapidapi_http_429')) {
      friendly = 'Límite de la API alcanzado. Intenta en unos minutos.';
    } else if (raw === 'no_media_found') {
      friendly = 'No se encontró video en ese link. Asegúrate de que sea un Reel público.';
    }

    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
