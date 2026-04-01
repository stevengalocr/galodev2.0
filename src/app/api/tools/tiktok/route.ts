/**
 * TikTok Downloader API Route
 *
 * Uses tikwm.com — free, no auth required, reliable.
 * Returns HD (no watermark) + SD (no watermark) + SD (with watermark).
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, message: 'URL es requerida.' }, { status: 400 });
    }

    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes('tiktok.com') && !parsed.hostname.includes('vm.tiktok.com')) {
        return NextResponse.json(
          { success: false, message: 'La URL debe ser de TikTok.' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ success: false, message: 'URL inválida.' }, { status: 400 });
    }

    const apiResponse = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
      {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GaloDev/1.0)' },
        cache: 'no-store',
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`API respondió con status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // tikwm response: { code: 0, msg: "success", data: { play, wmplay, hdplay, size, wm_size, hd_size } }
    if (data?.code !== 0 || !data?.data) {
      return NextResponse.json(
        { success: false, message: data?.msg || 'No se pudo obtener el video. Verifica que sea público.' },
        { status: 404 }
      );
    }

    const { play, wmplay, hdplay, size, wm_size, hd_size } = data.data;

    const medias: {
      url: string;
      quality: string;
      extension: string;
      size?: string;
      withWatermark?: boolean;
    }[] = [];

    if (hdplay) {
      medias.push({
        url: hdplay,
        quality: 'HD · Sin marca de agua',
        extension: 'mp4',
        size: hd_size ? `${(hd_size / 1024 / 1024).toFixed(1)} MB` : undefined,
        withWatermark: false,
      });
    }

    if (play) {
      medias.push({
        url: play,
        quality: 'SD · Sin marca de agua',
        extension: 'mp4',
        size: size ? `${(size / 1024 / 1024).toFixed(1)} MB` : undefined,
        withWatermark: false,
      });
    }

    if (wmplay) {
      medias.push({
        url: wmplay,
        quality: 'SD · Con marca de agua',
        extension: 'mp4',
        size: wm_size ? `${(wm_size / 1024 / 1024).toFixed(1)} MB` : undefined,
        withWatermark: true,
      });
    }

    if (medias.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No se encontraron videos descargables.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, medias });
  } catch (err: unknown) {
    console.error('[TikTok API Error]', err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Error interno al procesar la solicitud.',
      },
      { status: 500 }
    );
  }
}
