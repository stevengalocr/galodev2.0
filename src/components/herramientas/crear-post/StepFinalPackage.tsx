'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Copy, Check, RefreshCw, ChevronLeft, ChevronRight,
  Sparkles, Hash, MessageSquare,
} from 'lucide-react';
import type { CopyDraft } from '@/lib/crear-post/types';
import JSZip from 'jszip';

interface Props {
  draft: CopyDraft;
  imageUrls: string[];
  totalCostUsd: number;
  onRestart: () => void;
}

export default function StepFinalPackage({ draft, imageUrls, totalCostUsd, onRestart }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState<'caption' | 'hashtags' | 'cta' | null>(null);
  const [downloading, setDownloading] = useState(false);

  const validUrls = imageUrls.filter(Boolean);

  const copyText = async (text: string, key: 'caption' | 'hashtags' | 'cta') => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const imagesFolder = zip.folder('imagenes')!;

      // Download each image and add to zip
      await Promise.all(
        validUrls.map(async (url, i) => {
          const res = await fetch(url);
          const blob = await res.blob();
          const arrayBuffer = await blob.arrayBuffer();
          imagesFolder.file(`slide-${String(i + 1).padStart(2, '0')}.png`, arrayBuffer);
        })
      );

      zip.file('caption.txt', draft.caption);
      zip.file('hashtags.txt', draft.hashtags.map((h) => `#${h}`).join(' '));
      zip.file('cta.txt', draft.cta);
      zip.file(
        'metadata.json',
        JSON.stringify(
          {
            title: draft.title,
            approach: draft.approach,
            totalSlides: draft.slides.length,
            totalCostUsd,
            generatedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `galodev_post_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert('Error al generar el ZIP. Descargá las imágenes manualmente.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[900px] mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" 
        style={{ 
          padding: '0.25rem 1rem',
          background: 'rgba(52,211,153,0.1)', 
          border: '1px solid rgba(52,211,153,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-emerald-400">
            Post listo para publicar
          </span>
        </div>
        <h2 className="text-[32px] font-bold text-white tracking-tight mb-2">
          🎉 {draft.title}
        </h2>
        <p className="text-[14px] text-white/35">
          {validUrls.length} slides generados · Costo total: ${totalCostUsd.toFixed(3)}
        </p>
      </div>

      <div style={{padding:'1.5rem'}} className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-6">
        {/* Left: slide preview */}
        <div className="flex flex-col gap-3">
          {/* Main preview */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: '4/5', background: 'rgba(5,7,20,0.9)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            {validUrls[currentSlide] ? (
              <img
                src={validUrls[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                Sin imagen
              </div>
            )}
            {/* Slide counter overlay */}
            <div
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            >
              {currentSlide + 1}/{validUrls.length}
            </div>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl text-white/35 hover:text-white/65 transition-colors disabled:opacity-20"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Thumbnail strip */}
            <div className="flex gap-1.5 overflow-x-auto">
              {validUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="flex-shrink-0 w-10 rounded-lg overflow-hidden transition-all"
                  style={{
                    aspectRatio: '4/5',
                    border: i === currentSlide ? '2px solid #3B82F6' : '2px solid transparent',
                    opacity: i === currentSlide ? 1 : 0.45,
                  }}
                >
                  {url ? (
                    <img src={url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/05" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(Math.min(validUrls.length - 1, currentSlide + 1))}
              disabled={currentSlide >= validUrls.length - 1}
              className="p-2 rounded-xl text-white/35 hover:text-white/65 transition-colors disabled:opacity-20"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: copy + actions */}
        <div className="flex flex-col gap-4">
          {/* Caption */}
          <CopyBlock
            icon={<MessageSquare size={14} />}
            label="Caption"
            content={draft.caption}
            isCopied={copied === 'caption'}
            onCopy={() => copyText(draft.caption, 'caption')}
            maxLines={5}
          />

          {/* Hashtags */}
          <CopyBlock
            icon={<Hash size={14} />}
            label="Hashtags"
            content={draft.hashtags.map((h) => `#${h}`).join(' ')}
            isCopied={copied === 'hashtags'}
            onCopy={() => copyText(draft.hashtags.map((h) => `#${h}`).join(' '), 'hashtags')}
          />

          {/* CTA */}
          <CopyBlock
            icon={<Sparkles size={14} />}
            label="CTA sugerido"
            content={draft.cta}
            isCopied={copied === 'cta'}
            onCopy={() => copyText(draft.cta, 'cta')}
          />

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
              style={{
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(135deg, #2d5ec7 0%, #4a7fff 100%)',
                boxShadow: '0 6px 24px rgba(59,111,217,0.35)',
              }}
            >
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.07] transition-opacity" />
              <Download size={16} className={downloading ? 'animate-bounce' : ''} />
              {downloading ? 'Generando ZIP…' : '📦 Descargar ZIP completo'}
            </button>

            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] text-white/40 hover:text-white/65 transition-colors"
              style={{ 
                padding: '0.75rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <RefreshCw size={13} />
              Crear otro post
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Copy block ────────────────────────────────────────────────────────────────

function CopyBlock({
  icon, label, content, isCopied, onCopy, maxLines,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  isCopied: boolean;
  onCopy: () => void;
  maxLines?: number;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        padding: '0.75rem 1.25rem',
        background: 'rgba(5,7,20,0.96)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-white/35">
          {icon}
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase">{label}</span>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
          style={{ color: isCopied ? '#34d399' : 'rgba(255,255,255,0.3)' }}
        >
          {isCopied ? <Check size={12} /> : <Copy size={12} />}
          {isCopied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <p
        className="text-[13px] text-white/55 leading-relaxed"
        style={maxLines ? { display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}
      >
        {content}
      </p>
    </div>
  );
}
