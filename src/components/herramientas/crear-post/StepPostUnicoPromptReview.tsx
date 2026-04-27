'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, ArrowRight, ChevronDown, ChevronUp, Hash, MessageSquare, Lightbulb } from 'lucide-react';
import type { CopyDraft } from '@/lib/crear-post/types';

interface Props {
  draft: CopyDraft;
  onConfirm: (editedPrompt: string) => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export default function StepPostUnicoPromptReview({ draft, onConfirm, onRegenerate, onBack }: Props) {
  const originalPrompt = draft.slides[0]?.imagenPrompt ?? '';
  const [prompt, setPrompt] = useState(originalPrompt);
  const [showCaption, setShowCaption] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const charCount = prompt.length;
  const isEdited = prompt !== originalPrompt;
  const isEmpty = prompt.trim().length < 50;

  return (
    <motion.div
      key="prompt_review"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[680px] mx-auto flex flex-col gap-4"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)' }}
        >
          <Sparkles size={11} style={{ color: '#a78bfa' }} />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: '#a78bfa' }}>
            Prompt de Imagen
          </span>
        </div>
        <h2 className="text-[24px] font-bold text-white mb-1">Revisá el prompt antes de generar</h2>
        <p className="text-[13px] text-white/35">
          Claude escribió este prompt para Google Imagen. Editalo hasta que quede perfecto — después genera.
        </p>
      </div>

      {/* Title */}
      <div
        className="rounded-2xl px-5 py-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/25 mb-1">Título del post</p>
        <p className="text-[15px] font-semibold text-white">{draft.title}</p>
      </div>

      {/* Prompt editor — the main event */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(5,7,20,0.96)',
          border: `1px solid ${isEdited ? 'rgba(167,139,250,0.4)' : 'rgba(80,137,255,0.22)'}`,
          boxShadow: isEdited ? '0 0 0 1px rgba(167,139,250,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Editor header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: isEdited ? '#a78bfa' : '#3B82F6' }}
            />
            <span className="text-[12px] font-mono text-white/40">
              imagenPrompt{isEdited && <span style={{ color: '#a78bfa' }}> · editado</span>}
            </span>
          </div>
          <span
            className="text-[11px] font-mono"
            style={{ color: charCount < 200 ? '#f87171' : charCount > 800 ? '#fbbf24' : '#34d399' }}
          >
            {charCount} chars {charCount < 200 ? '— muy corto' : charCount > 800 ? '— largo, OK' : '— buen largo'}
          </span>
        </div>

        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={14}
          placeholder="Escribí el prompt detallado para Google Imagen…"
          className="w-full resize-none bg-transparent outline-none text-white/80 placeholder-white/20 font-mono leading-relaxed"
          style={{
            padding: '1.25rem 1.25rem',
            fontSize: '12.5px',
            lineHeight: '1.75',
          }}
        />

        {/* Reset button */}
        {isEdited && (
          <div
            className="flex justify-end px-5 py-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <button
              type="button"
              onClick={() => setPrompt(originalPrompt)}
              className="text-[11.5px] text-white/25 hover:text-white/55 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={11} />
              Restaurar prompt original de Claude
            </button>
          </div>
        )}
      </div>

      {/* Tips collapsible */}
      <button
        type="button"
        onClick={() => setShowTips(!showTips)}
        className="flex items-center justify-between w-full text-left px-5 py-3 rounded-xl transition-colors"
        style={{
          background: 'rgba(251,191,36,0.05)',
          border: '1px solid rgba(251,191,36,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={13} style={{ color: '#fbbf24' }} />
          <span className="text-[12.5px] font-semibold" style={{ color: '#fbbf24' }}>
            Tips para mejorar el prompt
          </span>
        </div>
        {showTips ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
      </button>

      {showTips && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl px-5 py-4 text-[12px] text-white/50 leading-relaxed flex flex-col gap-2"
          style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.1)' }}
        >
          <p><strong className="text-white/70">Formato obligatorio:</strong> Siempre empezá con <code className="text-yellow-300/60">"Portrait Instagram post 1080x1080px, premium dark design"</code></p>
          <p><strong className="text-white/70">Incluí TODO el texto:</strong> Cada palabra que debe aparecer en la imagen va en el prompt, entre comillas. Imagen lo renderiza tal cual.</p>
          <p><strong className="text-white/70">Fondo GaloDev:</strong> <code className="text-yellow-300/60">"dark navy background #020617, electric blue #3B82F6 accents"</code></p>
          <p><strong className="text-white/70">Watermark obligatorio:</strong> <code className="text-yellow-300/60">"small 'GaloDev.com' text bottom-right in #3B82F6"</code></p>
          <p><strong className="text-white/70">Estilo:</strong> <code className="text-yellow-300/60">"Vercel dark mode aesthetic, premium infographic, viral tech design"</code></p>
          <p><strong className="text-white/70">Largo ideal:</strong> 200–600 palabras. Más detalle = mejor resultado.</p>
        </motion.div>
      )}

      {/* Caption preview collapsible */}
      <button
        type="button"
        onClick={() => setShowCaption(!showCaption)}
        className="flex items-center justify-between w-full text-left px-5 py-3 rounded-xl transition-colors"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-white/30" />
          <span className="text-[12.5px] text-white/45">Caption para Instagram</span>
        </div>
        {showCaption ? <ChevronUp size={14} className="text-white/20" /> : <ChevronDown size={14} className="text-white/20" />}
      </button>

      {showCaption && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-xl px-5 py-4 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-[12.5px] text-white/55 whitespace-pre-wrap leading-relaxed">{draft.caption}</p>
          {draft.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {draft.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                  style={{ background: 'rgba(59,130,246,0.1)', color: '#7baeff', border: '1px solid rgba(59,130,246,0.18)' }}
                >
                  <Hash size={9} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* CTA */}
      <div className="text-[12px] text-white/35 text-center px-2">
        <strong className="text-white/50">CTA:</strong> {draft.cta}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] text-white/40 hover:text-white/65 transition-all duration-200 cursor-pointer"
          style={{ border: '1px solid rgba(255,255,255,0.08)', flex: '0 0 auto' }}
        >
          <RefreshCw size={13} />
          Regenerar
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] text-white/40 hover:text-white/65 transition-all duration-200 cursor-pointer"
          style={{ border: '1px solid rgba(255,255,255,0.08)', flex: '0 0 auto' }}
        >
          ← Brief
        </button>

        <button
          type="button"
          onClick={() => onConfirm(prompt)}
          disabled={isEmpty}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden cursor-pointer"
          style={{
            background: isEmpty
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
            boxShadow: isEmpty ? 'none' : '0 8px 24px rgba(124,58,237,0.35)',
          }}
        >
          <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.07] transition-opacity" />
          Confirmar prompt y generar
          <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
