'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Search,
  Clock,
  Music,
  Video,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Trash2,
} from 'lucide-react';
import { SiTiktok, SiInstagram } from 'react-icons/si';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

/* ── Types ─────────────────────────────────────────────────────── */

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

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function DescargarPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VideoResult | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [justDownloaded, setJustDownloaded] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/herramientas/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'No se pudo procesar el video.');
      } else {
        setResult(json.data);
      }
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (opt: DownloadOption) => {
    setDownloading(opt.label);
    try {
      const resp = await fetch(opt.url);
      const blob = await resp.blob();
      const ext = opt.type === 'audio' ? 'mp3' : 'mp4';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `galodev_${result?.platform}_${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
      setJustDownloaded(opt.label);
      setTimeout(() => setJustDownloaded(null), 3000);
    } catch {
      window.open(opt.url, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/herramientas/login');
    router.refresh();
  };

  const handleClear = () => {
    setResult(null);
    setUrl('');
    setError('');
  };

  const isTikTok = url.includes('tiktok.com') || url.includes('vm.tiktok.com');
  const isInstagram = url.includes('instagram.com') || url.includes('instagr.am');

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)', background: '#020617' }}
    >
      {/* Space background */}
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      {/* Glow blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(59,111,217,0.08) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: '5%',
            right: '0%',
            background: 'radial-gradient(circle, rgba(124,59,217,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-8"
        style={{
          height: '60px',
          background: 'rgba(2, 6, 23, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Left: brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-[15px] font-bold text-white group-hover:text-white/80 transition-colors">
            GaloDev
          </span>
          <span className="text-white/20 text-sm hidden sm:block">/</span>
          <span className="hidden sm:flex items-center gap-1.5 text-[13px] text-white/40">
            <Download size={12} />
            Descargador
          </span>
        </Link>

        {/* Right: logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white/70 transition-colors duration-200 group px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          <span className="hidden sm:block">Cerrar sesión</span>
        </button>
      </header>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center pt-[88px] pb-20 px-5">
        {/* Page title */}
        <div className="w-full max-w-[560px] text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(59,111,217,0.15)',
                border: '1px solid rgba(80,137,255,0.3)',
              }}
            >
              <Download size={15} style={{ color: '#5089ff' }} />
            </div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30">
              Herramienta
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-white leading-tight mb-2">
            Descargador de Videos
          </h1>
          <p className="text-[14px] text-white/40 font-light">
            TikTok sin marca de agua · Instagram Reels en HD
          </p>
        </div>

        {/* ── Search card ──────────────────────────────────────── */}
        <div
          className="w-full max-w-[560px] rounded-2xl p-5 sm:p-6 mb-5"
          style={{
            background: 'rgba(6, 8, 22, 0.92)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Platform indicator */}
          <div className="flex items-center gap-2 mb-4">
            <PlatformPill
              icon={SiTiktok}
              label="TikTok"
              active={isTikTok}
              color="#5089ff"
            />
            <PlatformPill
              icon={SiInstagram}
              label="Instagram Reels"
              active={isInstagram}
              color="#a78bfa"
            />
          </div>

          {/* Input */}
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (result) setResult(null); if (error) setError(''); }}
                placeholder="Pega el enlace aquí..."
                className="w-full h-[48px] rounded-xl text-[14px] text-white outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: url ? '1px solid rgba(80,137,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  paddingLeft: '16px',
                  paddingRight: url ? '44px' : '16px',
                  caretColor: '#5089ff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(80,137,255,0.5)';
                  e.currentTarget.style.background = 'rgba(59,111,217,0.07)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,111,217,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = url ? '1px solid rgba(80,137,255,0.35)' : '1px solid rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = url ? 'rgba(59,111,217,0.05)' : 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="h-[48px] px-6 rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 flex-shrink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3b6fd9 0%, #5089ff 100%)',
                boxShadow: (!loading && url) ? '0 6px 24px rgba(59,111,217,0.3)' : 'none',
                minWidth: '130px',
              }}
            >
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.08] transition-opacity" />
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )}
              <span className="relative">{loading ? 'Analizando…' : 'Analizar'}</span>
            </button>
          </form>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#fca5a5',
                  }}
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-px" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Result card ──────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[560px] rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(6, 8, 22, 0.92)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Thumbnail */}
              {result.thumbnail && (
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={result.thumbnail}
                    alt={result.title || 'thumbnail'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[rgba(2,6,23,0.3)] to-transparent" />

                  {/* Badges overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    {result.duration != null && (
                      <span
                        className="flex items-center gap-1 text-[11px] text-white/80 px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                      >
                        <Clock size={10} />
                        {fmtDuration(result.duration)}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1.5 text-[11px] text-white/80 px-2.5 py-1 rounded-full capitalize"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                    >
                      {result.platform === 'tiktok' ? <SiTiktok size={10} /> : <SiInstagram size={10} />}
                      {result.platform}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-6">
                {/* Author */}
                {result.author && (
                  <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {result.authorAvatar && (
                      <Image
                        src={result.authorAvatar}
                        alt={result.author}
                        width={38}
                        height={38}
                        className="rounded-full flex-shrink-0 ring-1 ring-white/10"
                        unoptimized
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-white truncate">{result.author}</p>
                      {result.authorHandle && (
                        <p className="text-[12px] text-white/35 truncate">@{result.authorHandle}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Title */}
                {result.title && result.title !== 'Instagram Reel' && (
                  <p className="text-[13px] text-white/55 leading-relaxed mb-5 line-clamp-2">
                    {result.title}
                  </p>
                )}

                {/* Download options */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 mb-1">
                    Descargar como
                  </p>

                  {result.downloads.map((opt) => {
                    const isMain = opt.type === 'video' && !opt.label.toLowerCase().includes('marca');
                    const isDone = justDownloaded === opt.label;
                    const isBusy = downloading === opt.label;

                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleDownload(opt)}
                        disabled={!!downloading}
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-[13px] font-medium transition-all duration-200 disabled:opacity-50 group"
                        style={{
                          background: isDone
                            ? 'rgba(52,211,153,0.1)'
                            : isMain
                            ? 'rgba(59,111,217,0.12)'
                            : 'rgba(255,255,255,0.04)',
                          border: isDone
                            ? '1px solid rgba(52,211,153,0.3)'
                            : isMain
                            ? '1px solid rgba(80,137,255,0.25)'
                            : '1px solid rgba(255,255,255,0.07)',
                          color: isDone ? '#34d399' : 'white',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {opt.type === 'audio' ? (
                            <Music size={15} className="flex-shrink-0 text-white/40" />
                          ) : (
                            <Video
                              size={15}
                              className="flex-shrink-0"
                              style={{ color: isMain ? '#5089ff' : 'rgba(255,255,255,0.4)' }}
                            />
                          )}
                          <span>{opt.label}</span>
                          {isMain && !isDone && (
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                background: 'rgba(80,137,255,0.15)',
                                color: '#7baeff',
                                border: '1px solid rgba(80,137,255,0.2)',
                              }}
                            >
                              Recomendado
                            </span>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {isBusy ? (
                            <Loader2 size={15} className="animate-spin text-white/40" />
                          ) : isDone ? (
                            <CheckCircle2 size={15} style={{ color: '#34d399' }} />
                          ) : (
                            <Download size={15} className="text-white/30 group-hover:text-white/60 transition-colors" />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Open original */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[12px] text-white/25 hover:text-white/45 transition-colors mt-1"
                    style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <ExternalLink size={12} />
                    Ver en la plataforma original
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ───────────────────────────────────────── */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-[560px]"
          >
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: 'rgba(6, 8, 22, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/20 mb-4">
                Plataformas soportadas
              </p>
              <div className="grid grid-cols-2 gap-3">
                <SupportCard
                  icon={SiTiktok}
                  name="TikTok"
                  features={['Sin marca de agua', 'Solo audio MP3', 'HD disponible']}
                  color="#5089ff"
                  bg="rgba(59,111,217,0.08)"
                  border="rgba(80,137,255,0.15)"
                />
                <SupportCard
                  icon={SiInstagram}
                  name="Instagram Reels"
                  features={['Video en HD', 'Descarga directa']}
                  color="#a78bfa"
                  bg="rgba(124,59,217,0.08)"
                  border="rgba(167,139,250,0.15)"
                />
              </div>
              <p className="text-[11px] text-white/18 text-center mt-5">
                Solo videos públicos · Uso personal
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function PlatformPill({
  icon: Icon,
  label,
  active,
  color,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200"
      style={{
        background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
        border: active ? `1px solid ${color}35` : '1px solid rgba(255,255,255,0.07)',
        color: active ? color : 'rgba(255,255,255,0.3)',
      }}
    >
      <Icon size={11} />
      {label}
    </span>
  );
}

function SupportCard({
  icon: Icon,
  name,
  features,
  color,
  bg,
  border,
}: {
  icon: React.ElementType;
  name: string;
  features: string[];
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} style={{ color, flexShrink: 0 }} />
        <span className="text-[13px] font-semibold text-white">{name}</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[12px] text-white/45">
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
