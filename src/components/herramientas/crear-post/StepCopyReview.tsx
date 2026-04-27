'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, CheckCircle2, RefreshCw, Edit3, ChevronLeft, Copy, Check,
} from 'lucide-react';
import type { CopyDraft, CopyDraftPair, Slide } from '@/lib/crear-post/types';
import { PILAR_ACCENT_COLORS } from '@/lib/crear-post/constants';
import type { Pilar } from '@/lib/crear-post/types';

interface Props {
  pair: CopyDraftPair;
  pilar: Pilar;
  onSelect: (draft: CopyDraft) => void;
  onRegenerate: () => void;
  onBack: () => void;
  isRegenerating: boolean;
}

export default function StepCopyReview({
  pair, pilar, onSelect, onRegenerate, onBack, isRegenerating,
}: Props) {
  const [editing, setEditing] = useState<{ variant: 'A' | 'B'; slides: Slide[] } | null>(null);

  const acento = PILAR_ACCENT_COLORS[pilar];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[900px] mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-400/60 mb-3">
          Paso 3 de 4 · Revisá y elegí
        </p>
        <h2 className="text-[30px] font-bold text-white tracking-tight mb-2">
          2 variantes generadas
        </h2>
        <p className="text-[14px] text-white/35">
          Costo Claude: <span className="text-white/55">${pair.costUsd.toFixed(4)}</span> ·{' '}
          {pair.tokensUsed.toLocaleString()} tokens
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {pair.variants.map((variant) => {
          const isEditing = editing?.variant === variant.variantLabel;
          const displaySlides = isEditing ? editing!.slides : variant.slides;

          return (
            <VariantCard
              key={variant.variantLabel}
              variant={variant}
              displaySlides={displaySlides}
              isEditing={isEditing}
              acento={acento}
              onEdit={() =>
                setEditing({ variant: variant.variantLabel, slides: [...variant.slides] })
              }
              onSlideEdit={(idx, newSlide) => {
                if (!editing) return;
                const updated = [...editing.slides];
                updated[idx] = newSlide;
                setEditing({ ...editing, slides: updated });
              }}
              onCancelEdit={() => setEditing(null)}
              onSelect={() => {
                const finalDraft = isEditing
                  ? { ...variant, slides: editing!.slides }
                  : variant;
                onSelect(finalDraft);
              }}
            />
          );
        })}
      </div>

      <div style={{marginTop:'1rem'}} className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] text-white/35 hover:text-white/60 transition-colors"
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <ChevronLeft size={14} />
          Editar brief
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] text-white/45 hover:text-white/70 transition-all disabled:opacity-40"
          style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
          {isRegenerating ? 'Regenerando…' : 'Regenerar ambas'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Variant card ─────────────────────────────────────────────────────────────

function VariantCard({
  variant,
  displaySlides,
  isEditing,
  acento,
  onEdit,
  onSlideEdit,
  onCancelEdit,
  onSelect,
}: {
  variant: CopyDraft;
  displaySlides: Slide[];
  isEditing: boolean;
  acento: string;
  onEdit: () => void;
  onSlideEdit: (idx: number, slide: Slide) => void;
  onCancelEdit: () => void;
  onSelect: () => void;
}) {
  const [expandedSlides, setExpandedSlides] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = async () => {
    await navigator.clipboard.writeText(variant.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ padding: '1rem', background: 'rgba(5,7,20,0.96)', border: '1px solid rgba(255,255,255,0.09)' }}
    >
      {/* Header */}
      <div
        className="p-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
            style={{ 
              padding: '0.25rem 0.75rem',
              background: `${acento}18`, color: acento, border: `1px solid ${acento}30` }}
          >
            Variante {variant.variantLabel}
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors"
          >
            <Edit3 size={12} />
            Editar
          </button>
        </div>
        <p className="text-[12px] text-white/35 italic">{variant.approach}</p>
        <p className="text-[16px] font-bold text-white mt-2 leading-tight">{variant.title}</p>
      </div>

      {/* Slides */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <button
          type="button"
          onClick={() => setExpandedSlides(!expandedSlides)}
          className="flex items-center justify-between text-[12px] font-bold text-white/35 hover:text-white/55 transition-colors mb-1"
        >
          <span>{displaySlides.length} SLIDES</span>
          {expandedSlides ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        <AnimatePresence>
          {expandedSlides && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-2 overflow-hidden"
            >
              {displaySlides.map((slide, i) => (
                <SlideRow
                  key={i}
                  slide={slide}
                  index={i}
                  acento={acento}
                  isEditing={isEditing}
                  onEdit={(s) => onSlideEdit(i, s)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Caption */}
        <div
          className="mt-3 rounded-xl p-3"
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/22">
              Caption
            </span>
            <button onClick={handleCopyCaption} className="text-white/25 hover:text-white/55 transition-colors">
              {copied ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
            </button>
          </div>
          <p className="text-[12px] text-white/45 leading-relaxed line-clamp-3">
            {variant.caption}
          </p>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {variant.hashtags.map((h) => (
            <span
              key={h}
              className="text-[10px] px-2 py-0.5 rounded-full text-white/25"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              #{h}
            </span>
          ))}
        </div>
      </div>

      {/* Select button */}
      <div className="p-5 pt-0">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full mb-2 py-2.5 rounded-xl text-[13px] text-white/40 hover:text-white/60 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            Cancelar edición
          </button>
        )}
        <button
          type="button"
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold text-white transition-all duration-300 relative overflow-hidden"
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: `linear-gradient(135deg, ${acento}cc, ${acento})`,
            boxShadow: `0 6px 24px ${acento}33`,
          }}
        >
          <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.08] transition-opacity" />
          <CheckCircle2 size={16} />
          Usar variante {variant.variantLabel}
        </button>
      </div>
    </div>
  );
}

// ── Slide row ─────────────────────────────────────────────────────────────────

function SlideRow({
  slide, index, acento, isEditing, onEdit,
}: {
  slide: Slide;
  index: number;
  acento: string;
  isEditing: boolean;
  onEdit: (s: Slide) => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const SLIDE_TYPE_LABELS: Record<string, string> = {
    hook: 'Hook', roadmap: 'Mapa', body: 'Cuerpo', summary: 'Resumen', cta: 'CTA',
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
          style={{ background: `${acento}20`, color: acento }}
        >
          {slide.number}
        </span>
        <span className="flex-1 text-[12.5px] text-white/65 truncate">{slide.titulo}</span>
        <span
          className="text-[9.5px] px-1.5 py-0.5 rounded font-bold tracking-wide"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
        >
          {SLIDE_TYPE_LABELS[slide.type] ?? slide.type}
        </span>
        {expanded ? <ChevronUp size={11} className="text-white/25" /> : <ChevronDown size={11} className="text-white/25" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {isEditing ? (
                <>
                  <EditableField
                    label="Título"
                    value={slide.titulo}
                    onChange={(v) => onEdit({ ...slide, titulo: v })}
                  />
                  {slide.subtitulo !== undefined && (
                    <EditableField
                      label="Subtítulo"
                      value={slide.subtitulo ?? ''}
                      onChange={(v) => onEdit({ ...slide, subtitulo: v })}
                    />
                  )}
                  {slide.cuerpo !== undefined && (
                    <EditableField
                      label="Cuerpo"
                      value={slide.cuerpo ?? ''}
                      onChange={(v) => onEdit({ ...slide, cuerpo: v })}
                      multiline
                    />
                  )}
                  {slide.snippet !== undefined && (
                    <EditableField
                      label="Snippet"
                      value={slide.snippet ?? ''}
                      onChange={(v) => onEdit({ ...slide, snippet: v })}
                      multiline
                      mono
                    />
                  )}
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-1.5">
                  {slide.subtitulo && (
                    <p className="text-[12px] text-white/50">{slide.subtitulo}</p>
                  )}
                  {slide.cuerpo && (
                    <p className="text-[12px] text-white/40 leading-relaxed">{slide.cuerpo}</p>
                  )}
                  {slide.snippet && (
                    <pre className="text-[11px] text-white/35 bg-white/[0.03] rounded-lg p-2 overflow-x-auto">
                      {slide.snippet}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditableField({
  label, value, onChange, multiline, mono,
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; mono?: boolean;
}) {
  const base = `w-full rounded-lg px-3 py-2 text-[12px] text-white/70 outline-none bg-white/[0.04]
    border border-white/[0.08] focus:border-blue-500/40 transition-colors resize-none`;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-white/30 font-semibold tracking-wide uppercase">{label}</label>
      {multiline ? (
        <textarea
          className={`${base} ${mono ? 'font-mono' : ''}`}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
