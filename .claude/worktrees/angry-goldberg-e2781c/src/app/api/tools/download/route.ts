/**
 * Download Proxy Route
 *
 * Proxies media files from third-party CDNs so the browser `download`
 * attribute works correctly (cross-origin URLs are blocked by browsers).
 *
 * Usage: GET /api/tools/download?url=<encoded_url>&ext=mp4
 */

import { NextRequest, NextResponse } from 'next/server';

// Max file size to proxy: 200 MB
const MAX_BYTES = 200 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['mp4', 'jpg', 'jpeg', 'png', 'webp', 'mp3']);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get('url');
  const ext = searchParams.get('ext')?.toLowerCase() || 'mp4';

  if (!rawUrl) {
    return NextResponse.json({ error: 'URL requerida.' }, { status: 400 });
  }

  // Only allow known extensions
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: 'Extensión no permitida.' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'URL inválida.' }, { status: 400 });
  }

  // Only allow https
  if (targetUrl.protocol !== 'https:') {
    return NextResponse.json({ error: 'Solo se permiten URLs HTTPS.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GaloDev/1.0)',
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `El servidor remoto respondió con ${upstream.status}.` },
        { status: 502 }
      );
    }

    const contentLength = upstream.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_BYTES) {
      return NextResponse.json({ error: 'Archivo demasiado grande para proxear.' }, { status: 413 });
    }

    const contentType =
      upstream.headers.get('content-type') ||
      (ext === 'mp4' ? 'video/mp4' : ext === 'mp3' ? 'audio/mpeg' : 'image/jpeg');

    const filename = `galodev_download.${ext}`;

    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err: unknown) {
    console.error('[Download Proxy Error]', err);
    return NextResponse.json(
      { error: 'No se pudo descargar el archivo.' },
      { status: 500 }
    );
  }
}
