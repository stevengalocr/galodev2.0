'use client';

import { useState } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface MediaResult {
  url: string;
  quality: string;
  extension: string;
  size?: string;
}

export default function InstagramDownloaderPage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<MediaResult[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidUrl = (u: string) => {
    try {
      return new URL(u).hostname.includes('instagram.com');
    } catch {
      return false;
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || !isValidUrl(trimmed)) {
      setErrorMsg('Pega un link válido de Instagram.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setResults([]);
    setErrorMsg('');
    try {
      const res = await fetch('/api/tools/instagram', {
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', boxSizing: 'border-box' }}>

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
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #e1306c, #fd1d1d, #833ab4)' }} />

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
                background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                boxShadow: '0 8px 24px rgba(225,48,108,0.4)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.2, margin: 0 }}>
                Instagram Downloader
              </h1>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '3px 0 0' }}>
                Reels · Fotos · Carruseles · IGTV
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
                  placeholder="Pega el link de Instagram aquí..."
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
                    e.target.style.borderColor = 'rgba(225,48,108,0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(225,48,108,0.1)';
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
                  background: 'linear-gradient(135deg, #e1306c, #833ab4)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 20px rgba(225,48,108,0.35)',
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
                {results.length} archivo{results.length > 1 ? 's' : ''} encontrado{results.length > 1 ? 's' : ''}
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
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {media.quality || `Video ${i + 1}`}
                    </p>
                    {media.size && <p style={{ color: '#475569', fontSize: '11px', margin: '2px 0 0' }}>{media.size}</p>}
                  </div>
                  <a
                    href={`/api/tools/download?url=${encodeURIComponent(media.url)}&ext=${media.extension || 'mp4'}`}
                    download={`instagram_${i + 1}.${media.extension || 'mp4'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #e1306c, #833ab4)',
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
