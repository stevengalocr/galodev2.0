import { NextResponse } from 'next/server';

const TIKWM_API = 'https://www.tikwm.com/api/';

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
  const res = await fetch(TIKWM_API, {
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
    platform: 'tiktok',
    title: d.title,
    thumbnail: d.origin_cover || d.cover,
    duration: d.duration,
    author: d.author.nickname,
    authorHandle: d.author.unique_id,
    authorAvatar: d.author.avatar,
    downloads: [
      { label: 'Sin marca de agua', url: d.play, type: 'video' },
      { label: 'Con marca de agua', url: d.wmplay, type: 'video' },
      { label: 'Solo audio (MP3)', url: d.music, type: 'audio' },
    ],
  };
}

async function fetchInstagram(url: string) {
  const res = await fetch('https://api.cobalt.tools/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({
      url,
      downloadMode: 'auto',
      videoQuality: 'max',
      filenameStyle: 'pretty',
    }),
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error('cobalt_request_failed');

  const json = await res.json();

  if (json.status === 'error') throw new Error(json.error?.code || 'cobalt_error');

  const downloadUrl = json.url || (json.picker?.[0]?.url ?? null);
  if (!downloadUrl) throw new Error('no_download_url');

  return {
    platform: 'instagram',
    title: 'Instagram Reel',
    thumbnail: null,
    duration: null,
    author: null,
    authorHandle: null,
    authorAvatar: null,
    downloads: [{ label: 'Descargar Reel', url: downloadUrl, type: 'video' }],
  };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    const cleanUrl = url.trim();

    if (cleanUrl.includes('tiktok.com') || cleanUrl.includes('vm.tiktok.com')) {
      const data = await fetchTikTok(cleanUrl);
      return NextResponse.json({ success: true, data });
    }

    if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
      const data = await fetchInstagram(cleanUrl);
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { error: 'URL no soportada. Usa links de TikTok o Instagram Reels.' },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    const friendly =
      message.includes('tikwm') || message.includes('cobalt')
        ? 'No se pudo procesar el video. Verifica que el link sea válido y público.'
        : message;

    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
