'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Clock,
  Music,
  Video,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Trash2,
  Link2,
  Sparkles,
  ChevronRight,
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

/* ── Main ───────────────────────────────────────────────────────── */

export default function DescargarPage() {
  const [url, setUrl]                     = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [result, setResult]               = useState<VideoResult | null>(null);
  const [downloading, setDownloading]     = useState<string | null>(null);
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
      const res  = await fetch('/api/herramientas/download', {
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
      const ext  = opt.type === 'audio' ? 'mp3' : 'mp4';
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
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

  const isTikTok    = url.includes('tiktok.com') || url.includes('vm.tiktok.com');
  const isInstagram = url.includes('instagram.com') || url.includes('instagr.am');

  return (
    <div className="min-h-screen w-full relative" style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}>

      {/* ── Background ──────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <div className="bg-space" />
      </div>

      {/* ── Ambient glows ───────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute rounded-full" style={{
          width: 900, height: 600,
          top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(59,111,217,0.1) 0%, transparent 60%)',
        }} />
        <div className="absolute rounded-full" style={{
          width: 500, height: 500,
          bottom: '0%', right: '-5%',
          background: 'radial-gradient(circle, rgba(124,59,217,0.07) 0%, transparent 65%)',
        }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
      </div>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-8"
        style={{
          height: '64px',
          background: 'rgba(2, 4, 18, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Left: breadcrumb */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(59,111,217,0.18)',
              border: '1px solid rgba(80,137,255,0.3)',
            }}
          >
            <span className="text-[11px] font-black text-white/90" style={{ letterSpacing: '-0.05em' }}>G</span>
          </div>
          <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">
            GaloDev
          </span>
          <ChevronRight size={13} className="text-white/20" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Download size={11} style={{ color: '#5089ff' }} />
            <span className="text-[13px] text-white/45 font-medium">Descargador</span>
          </div>
        </Link>

        {/* Right: logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[12.5px] text-white/30 hover:text-white/65 transition-all duration-200 group px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.border = '1px solid transparent')}
        >
          <LogOut size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          <span className="hidden sm:block">Cerrar sesión</span>
        </button>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center pt-[108px] pb-24 px-5">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[580px] text-center mb-10"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
              style={{
                background: 'rgba(59,111,217,0.1)',
                border: '1px solid rgba(80,137,255,0.22)',
              }}
            >
              <Sparkles size={10} style={{ color: '#7baeff' }} />
              <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase" style={{ color: '#7baeff' }}>
                Herramienta
              </span>
            </div>
          </div>

          <h1 className="text-[32px] sm:text-[38px] font-bold text-white leading-[1.1] tracking-tight mb-3">
            Descargador de Videos
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/38 font-light leading-relaxed">
            TikTok sin marca de agua&nbsp;·&nbsp;Instagram Reels en HD
          </p>
        </motion.div>

        {/* ── Search card ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[580px] mb-4"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(5, 7, 20, 0.96)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
            }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 inset-x-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(59,111,217,0.6) 30%, rgba(167,139,250,0.45) 65%, transparent 100%)',
            }} />

            <div className="p-5 sm:p-7">
              {/* Platform indicators */}
              <div className="flex items-center gap-2 mb-5">
                <PlatformPill icon={SiTiktok}    label="TikTok"          active={isTikTok}    color="#5089ff" />
                <PlatformPill icon={SiInstagram} label="Instagram Reels" active={isInstagram} color="#a78bfa" />
              </div>

              {/* Input + button */}
              <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  {/* Left icon */}
                  <Link2
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
                    style={{ color: url ? 'rgba(130,175,255,0.55)' : 'rgba(255,255,255,0.2)' }}
                  />

                  <input
                    type="text"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (result) setResult(null); if (error) setError(''); }}
                    placeholder="Pega el enlace aquí…"
                    className="w-full h-[50px] rounded-xl text-[14px] text-white outline-none transition-all duration-200 placeholder:text-white/22"
                    style={{
                      background: url ? 'rgba(59,111,217,0.07)' : 'rgba(255,255,255,0.04)',
                      border: url ? '1px solid rgba(80,137,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      paddingLeft: '42px',
                      paddingRight: url ? '44px' : '16px',
                      caretColor: '#5089ff',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border = '1px solid rgba(80,137,255,0.55)';
                      e.currentTarget.style.background = 'rgba(59,111,217,0.09)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,111,217,0.12)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border = url ? '1px solid rgba(80,137,255,0.35)' : '1px solid rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = url ? 'rgba(59,111,217,0.07)' : 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/55 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="h-[50px] px-7 rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 flex-shrink-0 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{
                    background: (!loading && url.trim())
                      ? 'linear-gradient(135deg, #2d5ec7 0%, #4a7fff 60%, #5a8fff 100%)'
                      : 'rgba(40,55,100,0.5)',
                    boxShadow: (!loading && url.trim()) ? '0 6px 28px rgba(59,111,217,0.35)' : 'none',
                    minWidth: '130px',
                  }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.07] transition-opacity" />
                  {loading ? (
                    <Loader2 size={14} className="animate-spin flex-shrink-0" />
                  ) : (
                    <Download size={14} className="flex-shrink-0" />
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
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.22)',
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
          </div>
        </motion.div>

        {/* ── Result card ─────────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[580px] rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(5, 7, 20, 0.96)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05071400] via-[rgba(5,7,20,0.25)] to-transparent" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(5,7,20,0.95) 0%, rgba(5,7,20,0.3) 35%, transparent 70%)',
                  }} />

                  {/* Badges */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                    {result.duration != null && (
                      <span
                        className="flex items-center gap-1.5 text-[11px] text-white/80 px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
                      >
                        <Clock size={10} />
                        {fmtDuration(result.duration)}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1.5 text-[11px] text-white/80 px-2.5 py-1 rounded-full font-medium capitalize"
                      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
                    >
                      {result.platform === 'tiktok' ? <SiTiktok size={10} /> : <SiInstagram size={10} />}
                      {result.platform}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-7">
                {/* Author */}
                {result.author && (
                  <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {result.authorAvatar && (
                      <Image
                        src={result.authorAvatar}
                        alt={result.author}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                        style={{ boxShadow: '0 0 0 2px rgba(80,137,255,0.2)' }}
                        unoptimized
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-white truncate leading-tight">{result.author}</p>
                      {result.authorHandle && (
                        <p className="text-[12px] text-white/32 truncate mt-0.5">@{result.authorHandle}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Title */}
                {result.title && result.title !== 'Instagram Reel' && (
                  <p className="text-[13px] text-white/50 leading-relaxed mb-5 line-clamp-2">
                    {result.title}
                  </p>
                )}

                {/* Downloads */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/22 mb-2">
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
                            ? 'rgba(59,111,217,0.13)'
                            : 'rgba(255,255,255,0.03)',
                          border: isDone
                            ? '1px solid rgba(52,211,153,0.3)'
                            : isMain
                            ? '1px solid rgba(80,137,255,0.28)'
                            : '1px solid rgba(255,255,255,0.07)',
                          color: isDone ? '#34d399' : 'white',
                          boxShadow: isMain && !isDone ? '0 2px 12px rgba(59,111,217,0.1)' : 'none',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {opt.type === 'audio' ? (
                            <Music size={14} className="flex-shrink-0 text-white/35" />
                          ) : (
                            <Video
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: isMain ? '#5089ff' : 'rgba(255,255,255,0.35)' }}
                            />
                          )}
                          <span>{opt.label}</span>
                          {isMain && !isDone && (
                            <span
                              className="text-[9.5px] px-2 py-0.5 rounded-full font-bold tracking-wide"
                              style={{
                                background: 'rgba(80,137,255,0.15)',
                                color: '#7baeff',
                                border: '1px solid rgba(80,137,255,0.22)',
                              }}
                            >
                              Recomendado
                            </span>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {isBusy ? (
                            <Loader2 size={14} className="animate-spin text-white/35" />
                          ) : isDone ? (
                            <CheckCircle2 size={14} style={{ color: '#34d399' }} />
                          ) : (
                            <Download size={14} className="text-white/28 group-hover:text-white/60 transition-colors" />
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
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[12px] text-white/22 hover:text-white/42 transition-colors mt-1"
                    style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <ExternalLink size={11} />
                    Ver en la plataforma original
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ─────────────────────────────────────────── */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[580px]"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(5, 7, 20, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="px-5 sm:px-7 pt-6 pb-2">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/22">
                  Plataformas soportadas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 px-5 sm:px-7 pb-6">
                <SupportCard
                  icon={SiTiktok}
                  name="TikTok"
                  features={['Sin marca de agua', 'Solo audio MP3', 'HD disponible']}
                  color="#5089ff"
                  glowColor="rgba(59,111,217,0.15)"
                  border="rgba(80,137,255,0.18)"
                />
                <SupportCard
                  icon={SiInstagram}
                  name="Instagram Reels"
                  features={['Video en HD', 'Descarga directa']}
                  color="#a78bfa"
                  glowColor="rgba(124,59,217,0.12)"
                  border="rgba(167,139,250,0.18)"
                />
              </div>

              <div
                className="px-5 sm:px-7 py-3.5 flex items-center justify-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p className="text-[11px] text-white/18 text-center tracking-wide">
                  Solo videos públicos · Uso personal
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function PlatformPill({
  icon: Icon, label, active, color,
}: {
  icon: React.ElementType; label: string; active: boolean; color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium transition-all duration-250"
      style={{
        background: active ? `${color}1A` : 'rgba(255,255,255,0.04)',
        border: active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.07)',
        color: active ? color : 'rgba(255,255,255,0.28)',
        boxShadow: active ? `0 0 16px ${color}20` : 'none',
      }}
    >
      <Icon size={11} />
      {label}
    </span>
  );
}

function SupportCard({
  icon: Icon, name, features, color, glowColor, border,
}: {
  icon: React.ElementType; name: string; features: string[];
  color: string; glowColor: string; border: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: glowColor, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-[13px] font-semibold text-white">{name}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[12px] text-white/42">
            <CheckCircle2 size={11} style={{ color, flexShrink: 0, opacity: 0.7 }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
