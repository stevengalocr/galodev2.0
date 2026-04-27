'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import type { ProgressEvent } from '@/lib/crear-post/types';

interface SlideState {
  status: 'pending' | 'generating' | 'done' | 'failed';
  imageUrl?: string;
  elapsedMs?: number;
  archetype?: string;
  error?: string;
}

interface Props {
  events: ProgressEvent[];
  totalSlides: number;
  totalCostSoFar: number;
}

export default function StepProgress({ events, totalSlides, totalCostSoFar }: Props) {
  // Reconstruct state from events
  const bgDone = events.some((e) => e.type === 'background_done');
  const bgFallback = events.some((e) => e.type === 'background_fallback');
  const bgStarted = events.some((e) => e.type === 'background_started');
  const bgImageUrl = events.find((e) => e.type === 'background_done')
    ? (events.find((e) => e.type === 'background_done') as Extract<ProgressEvent, { type: 'background_done' }>).imageUrl
    : null;

  const slideStates: SlideState[] = Array.from({ length: totalSlides }, (_, i) => {
    const num = i + 1;
    const started = events.find(
      (e) => e.type === 'slide_started' && (e as Extract<ProgressEvent, { type: 'slide_started' }>).slide === num
    ) as Extract<ProgressEvent, { type: 'slide_started' }> | undefined;
    const done = events.find(
      (e) => e.type === 'slide_done' && (e as Extract<ProgressEvent, { type: 'slide_done' }>).slide === num
    ) as Extract<ProgressEvent, { type: 'slide_done' }> | undefined;
    const failed = events.find(
      (e) => e.type === 'slide_failed' && (e as Extract<ProgressEvent, { type: 'slide_failed' }>).slide === num
    ) as Extract<ProgressEvent, { type: 'slide_failed' }> | undefined;

    if (done) return { status: 'done', imageUrl: done.imageUrl, elapsedMs: done.elapsedMs, archetype: started?.archetype };
    if (failed) return { status: 'failed', error: failed.error, archetype: started?.archetype };
    if (started) return { status: 'generating', archetype: started.archetype };
    return { status: 'pending' };
  });

  const doneCount = slideStates.filter((s) => s.status === 'done').length;
  const progress = totalSlides > 0 ? (doneCount / totalSlides) * 100 : 0;
  const elapsedEvents = events.filter((e) => e.type === 'slide_done') as Extract<ProgressEvent, { type: 'slide_done' }>[];
  const totalElapsed = elapsedEvents.reduce((s, e) => s + e.elapsedMs, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[600px] mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-400/60 mb-3">
          Generando · Paso 4 de 4
        </p>
        <h2 className="text-[28px] font-bold text-white mb-2">Creando tu carrusel…</h2>
        <p className="text-[14px] text-white/35">
          {doneCount}/{totalSlides} slides · ${totalCostSoFar.toFixed(3)} · {(totalElapsed / 1000).toFixed(1)}s
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 rounded-full mb-8 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #2d5ec7, #4a7fff)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Background phase */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ background: 'rgba(5,7,20,0.96)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/25 mb-3">
          Fase 1 — Fondo único
        </p>
        <div className="flex items-center gap-3">
          <StatusIcon status={!bgStarted ? 'pending' : bgDone ? 'done' : bgFallback ? 'fallback' : 'generating'} />
          <div className="flex-1">
            <p className="text-[13px] text-white/65">
              {!bgStarted && 'Esperando…'}
              {bgStarted && !bgDone && !bgFallback && 'Generando fondo con Nano Banana…'}
              {bgDone && 'Fondo generado ✓'}
              {bgFallback && 'Usando fondo procedural (fallback) ✓'}
            </p>
          </div>
          {bgImageUrl && (
            <img
              src={bgImageUrl}
              alt="background preview"
              className="w-10 h-12 rounded-lg object-cover opacity-60"
            />
          )}
        </div>
      </div>

      {/* Slides phase */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(5,7,20,0.96)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/25 mb-3">
          Fase 2 — Slides ({doneCount}/{totalSlides})
        </p>
        <div className="flex flex-col gap-2">
          {slideStates.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <StatusIcon status={s.status === 'failed' ? 'failed' : s.status === 'done' ? 'done' : s.status === 'generating' ? 'generating' : 'pending'} />
              <span className="text-[13px] text-white/45 w-28">
                Slide {String(i + 1).padStart(2, '0')}
                {s.archetype && (
                  <span className="ml-1.5 text-[10px] text-white/20">· {s.archetype}</span>
                )}
              </span>
              <span className={`text-[12px] flex-1 ${s.status === 'done' ? 'text-white/55' : s.status === 'failed' ? 'text-red-400/70' : 'text-white/22'}`}>
                {s.status === 'pending' && '—'}
                {s.status === 'generating' && 'Renderizando…'}
                {s.status === 'done' && `Listo (${((s.elapsedMs ?? 0) / 1000).toFixed(1)}s)`}
                {s.status === 'failed' && (s.error ?? 'Error')}
              </span>
              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  alt={`slide ${i + 1}`}
                  className="w-8 h-10 rounded object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatusIcon({ status }: { status: 'pending' | 'generating' | 'done' | 'failed' | 'fallback' }) {
  if (status === 'done' || status === 'fallback')
    return <CheckCircle2 size={15} style={{ color: '#34d399', flexShrink: 0 }} />;
  if (status === 'generating')
    return <Loader2 size={15} className="animate-spin text-blue-400 flex-shrink-0" />;
  if (status === 'failed')
    return <AlertCircle size={15} className="text-red-400 flex-shrink-0" />;
  return <ImageIcon size={15} className="text-white/15 flex-shrink-0" />;
}
