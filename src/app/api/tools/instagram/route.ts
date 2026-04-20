/**
 * Instagram Downloader API Route
 *
 * Uses the "Social Media Video Downloader" RapidAPI service.
 * Supports: Instagram Reels, Photos, Carousels, IGTV, Stories.
 */

import { NextRequest, NextResponse } from 'next/server';

const RAPID_API_KEY = process.env.RAPIDAPI_KEY || '';
const RAPID_API_HOST = 'social-media-video-downloader.p.rapidapi.com';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, message: 'URL es requerida.' }, { status: 400 });
    }

    // Validate Instagram URL
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes('instagram.com')) {
        return NextResponse.json(
          { success: false, message: 'La URL debe ser de Instagram.' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ success: false, message: 'URL inválida.' }, { status: 400 });
    }

    if (!RAPID_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Servicio no configurado. Falta la API Key.' },
        { status: 503 }
      );
    }

    const apiResponse = await fetch(
      `https://${RAPID_API_HOST}/smvd/get/all?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': RAPID_API_HOST,
        },
        cache: 'no-store',
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`API respondió con status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // Social Media Video Downloader response shape:
    // { error: null, contents: [{ videos: [{ label: "...", url: "..." }] }] }
    const medias: { url: string; quality: string; extension: string; size?: string }[] = [];

    if (data?.contents && Array.isArray(data.contents)) {
      data.contents.forEach((content: { videos?: { label?: string; url?: string }[] }, contentIndex: number) => {
        if (content?.videos && Array.isArray(content.videos)) {
          content.videos.forEach((item: { label?: string; url?: string }) => {
            if (item.url) {
              const isImage = item.url.includes('.jpg') || item.url.includes('.jpeg') || item.url.includes('.png') || item.url.includes('.webp');
              medias.push({
                url: item.url,
                quality: item.label || (data.contents.length > 1 ? `Imagen ${contentIndex + 1}` : 'Alta Calidad'),
                extension: isImage ? 'jpg' : 'mp4',
              });
            }
          });
        }
      });
    }

    if (medias.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No se encontraron archivos descargables. Asegúrate de que el contenido sea público.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, medias });
  } catch (err: unknown) {
    console.error('[Instagram API Error]', err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : 'Error interno al procesar la solicitud.',
      },
      { status: 500 }
    );
  }
}
