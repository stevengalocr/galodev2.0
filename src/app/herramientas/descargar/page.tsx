'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Download,
  Search,
  ArrowLeft,
  Clock,
  User,
  Music,
  Video,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { SiTiktok, SiInstagram } from 'react-icons/si';

type DownloadOption = { label: string; url: string; type: 'video' | 'audio' };

type VideoResult = {
  platform: 'tiktok' | 'instagram';
  title: string | null;
  thumbnail: string | null;
  duration: number | null;
  author: string | null;
  authorHandle: string | null;
  authorAvatar: string | null;
  downloads: DownloadOption[];
};

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function DescargarPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VideoResult | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/herramientas/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Error al procesar el video.');
      } else {
        setResult(json.data);
      }
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (option: DownloadOption) => {
    setDownloading(option.label);
    try {
      const response = await fetch(option.url);
      const blob = await response.blob();
      const ext = option.type === 'audio' ? 'mp3' : 'mp4';
      const fileName = `galodev_${result?.platform ?? 'video'}_${Date.now()}.${ext}`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      setDownloaded(option.label);
      setTimeout(() => setDownloaded(null), 3000);
    } catch {
      window.open(option.url, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  const platformIcon =
    result?.platform === 'tiktok' ? (
      <SiTiktok size={14} className="text-white/60" />
    ) : (
      <SiInstagram size={14} className="text-white/60" />
    );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
    >
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,111,217,0.07) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 30% at 90% 80%, rgba(124,59,217,0.05) 0%, transparent 60%)',
          ].join(','),
        }}
      />

      <div className="relative z-10 px-4 sm:px-6 pb-16 pt-8 max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/herramientas"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          <span>Volver al panel</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(59,111,217,0.12)',
                border: '1px solid rgba(80,137,255,0.25)',
              }}
            >
              <Download size={18} style={{ color: 'var(--color-primary-400, #5089ff)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Descargador de Videos</h1>
              <p className="text-xs text-white/40">TikTok · Instagram Reels</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleAnalyze} className="mb-6">
          <div
            className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl"
            style={{
              background: 'rgba(8,11,24,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="relative flex-1">
              <div className="flex items-center gap-2 px-2 mb-2 sm:mb-0 sm:absolute sm:left-3 sm:top-1/2 sm:-translate-y-1/2">
                <SiTiktok size={14} className="text-white/30" />
                <SiInstagram size={14} className="text-white/30" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pega el link de TikTok o Instagram Reel..."
                required
                className="w-full sm:pl-14 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 bg-transparent"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(80,137,255,0.35)';
                  e.currentTarget.style.background = 'rgba(59,111,217,0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(59,111,217,0.9) 0%, rgba(80,137,255,0.8) 100%)',
                border: '1px solid rgba(80,137,255,0.3)',
                boxShadow: '0 6px 20px rgba(59,111,217,0.2)',
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              <span>{loading ? 'Analizando...' : 'Analizar'}</span>
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4 mb-6 text-sm"
            style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: '#fca5a5',
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,11,24,0.88)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            {/* Thumbnail */}
            {result.thumbnail && (
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={result.thumbnail}
                  alt={result.title || 'Video thumbnail'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,11,24,0.9)] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  {result.duration && (
                    <span
                      className="flex items-center gap-1.5 text-xs text-white/70 px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.5)' }}
                    >
                      <Clock size={11} />
                      {formatDuration(result.duration)}
                    </span>
                  )}
                  <span
                    className="flex items-center gap-1.5 text-xs text-white/70 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    {platformIcon}
                    <span className="capitalize">{result.platform}</span>
                  </span>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6">
              {/* Author */}
              {result.author && (
                <div className="flex items-center gap-3 mb-4">
                  {result.authorAvatar && (
                    <Image
                      src={result.authorAvatar}
                      alt={result.author}
                      width={36}
                      height={36}
                      className="rounded-full flex-shrink-0"
                      unoptimized
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{result.author}</p>
                    {result.authorHandle && (
                      <p className="text-xs text-white/40">@{result.authorHandle}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Title */}
              {result.title && result.title !== 'Instagram Reel' && (
                <p className="text-sm text-white/70 leading-relaxed mb-5 line-clamp-3">
                  {result.title}
                </p>
              )}

              {/* Download buttons */}
              <div className="flex flex-col gap-2.5">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-1">
                  Descargar como
                </p>
                {result.downloads.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleDownload(opt)}
                    disabled={!!downloading}
                    className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60"
                    style={{
                      background:
                        downloaded === opt.label
                          ? 'rgba(52,211,153,0.1)'
                          : opt.type === 'video' && !opt.label.includes('marca')
                          ? 'rgba(59,111,217,0.12)'
                          : 'rgba(255,255,255,0.04)',
                      border:
                        downloaded === opt.label
                          ? '1px solid rgba(52,211,153,0.3)'
                          : opt.type === 'video' && !opt.label.includes('marca')
                          ? '1px solid rgba(80,137,255,0.25)'
                          : '1px solid rgba(255,255,255,0.07)',
                      color: downloaded === opt.label ? '#34d399' : 'white',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {opt.type === 'audio' ? (
                        <Music size={16} className="text-white/50 flex-shrink-0" />
                      ) : (
                        <Video size={16} className="flex-shrink-0" style={{
                          color: opt.label.includes('Sin marca')
                            ? 'var(--color-primary-400, #5089ff)'
                            : 'rgba(255,255,255,0.5)'
                        }} />
                      )}
                      <span>{opt.label}</span>
                    </div>
                    <div className="flex-shrink-0">
                      {downloading === opt.label ? (
                        <Loader2 size={16} className="animate-spin text-white/50" />
                      ) : downloaded === opt.label ? (
                        <CheckCircle2 size={16} className="text-green-400" />
                      ) : (
                        <Download size={16} className="text-white/40" />
                      )}
                    </div>
                  </button>
                ))}

                {/* Open original */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-xs text-white/30 hover:text-white/50 transition-colors mt-1"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <ExternalLink size={13} />
                  <span>Ver original</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {!result && !loading && !error && (
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{
              background: 'rgba(8,11,24,0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-white/25 mb-4">
              Plataformas soportadas
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: SiTiktok,
                  name: 'TikTok',
                  desc: 'Sin marca de agua + audio',
                  color: '#5089ff',
                },
                {
                  icon: SiInstagram,
                  name: 'Instagram Reels',
                  desc: 'Video en HD',
                  color: '#a78bfa',
                },
              ].map(({ icon: Icon, name, desc, color }) => (
                <div
                  key={name}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <Icon size={20} style={{ color, flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs text-white/35">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/20 mt-4 text-center">
              Solo videos públicos · Uso personal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
