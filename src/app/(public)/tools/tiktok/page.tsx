'use client';

import { useState } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface MediaResult {
  url: string;
  quality: string;
  extension: string;
  size?: string;
  withWatermark?: boolean;
}

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<MediaResult[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidUrl = (u: string) => {
    try {
      const h = new URL(u).hostname;
      return h.includes('tiktok.com') || h.includes('vm.tiktok.com');
    } catch {
      return false;
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || !isValidUrl(trimmed)) {
      setErrorMsg('Pega un link válido de TikTok.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setResults([]);
    setErrorMsg('');
    try {
      const res = await fetch('/api/tools/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'No se pudo obtener el video.');
      setResults(data.medias);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al procesar la solicitud.');
    }
  };

  const handleClear = () => {
    setUrl('');
    setStatus('idle');
    setResults([]);
    setErrorMsg('');
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', boxSizing: 'border-box' }}>
      {/* Fade to black — matches footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '180px', pointerEvents: 'none', zIndex: 0,
        background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
      }} />

      {/* Back link */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Herramientas
        </Link>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '20px',
          background: 'rgba(12,12,24,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Top bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #010101, #69C9D0, #EE1D52)' }} />

        <div style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #010101, #69C9D0, #EE1D52)',
                boxShadow: '0 8px 24px rgba(238,29,82,0.4)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.27 8.27 0 0 0 4.83 1.55V6.87a4.85 4.85 0 0 1-1.06-.18z" />
              </svg>
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.2, margin: 0 }}>
                TikTok Downloader
              </h1>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '3px 0 0' }}>
                Sin marca de agua · Máxima calidad
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleDownload}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '0' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Pega el link de TikTok aquí..."
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '14px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(238,29,82,0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(238,29,82,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 22px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #69C9D0, #EE1D52)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 20px rgba(238,29,82,0.35)',
                  transition: 'opacity 0.2s, transform 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { if (status !== 'loading') (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                {status === 'loading' ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error */}
          {status === 'error' && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{errorMsg}</p>
              <button
                onClick={handleClear}
                style={{ color: '#f87171', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'underline' }}
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Loading shimmer */}
          {status === 'loading' && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ height: '64px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {/* Results */}
          {status === 'success' && results.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#22c55e"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {results.length} opción{results.length > 1 ? 'es' : ''} de descarga
              </p>
              {results.map((media, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                      {media.quality || `Video ${i + 1}`}
                      {media.withWatermark === false && (
                        <span style={{ marginLeft: '8px', fontSize: '11px', color: '#22c55e', fontWeight: 400 }}>Sin marca de agua</span>
                      )}
                      {media.withWatermark === true && (
                        <span style={{ marginLeft: '8px', fontSize: '11px', color: '#fbbf24', fontWeight: 400 }}>Con marca de agua</span>
                      )}
                    </p>
                    {media.size && <p style={{ color: '#475569', fontSize: '11px', margin: '2px 0 0' }}>{media.size}</p>}
                  </div>
                  <a
                    href={`/api/tools/download?url=${encodeURIComponent(media.url)}&ext=${media.extension || 'mp4'}`}
                    download={`tiktok_${i + 1}.${media.extension || 'mp4'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #69C9D0, #EE1D52)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '13px',
                      textDecoration: 'none',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar
                  </a>
                </div>
              ))}
              <button
                onClick={handleClear}
                style={{
                  marginTop: '4px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#64748b',
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                Descargar otro
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::placeholder { color: #475569; }
      `}</style>
    </div>
  );
}
