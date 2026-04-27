'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckSquare, Square, Zap, X } from 'lucide-react';
import type { CopyDraft } from '@/lib/crear-post/types';
import { estimateCost } from '@/lib/crear-post/constants';

interface Props {
  draft: CopyDraft;
  onConfirm: (costUsd: number, resolution: '1K' | '2K', mode: 'standard' | 'batch') => void;
  onCancel: () => void;
}

export default function StepApprovalGate({ draft, onConfirm, onCancel }: Props) {
  const [resolution, setResolution] = useState<'1K' | '2K'>('2K');
  const [mode, setMode] = useState<'standard' | 'batch'>('standard');
  const [checks, setChecks] = useState([false, false, false, false]);

  const n = draft.slides.length;
  const costUsd = estimateCost(n, resolution, mode);
  const allChecked = checks.every(Boolean);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const checkItems = [
    'Revisé el copy y los briefs visuales de cada slide.',
    `La cantidad de slides (${n}) es adecuada para el contenido.`,
    `Entiendo que cada reintento de background cuesta ~$0.11.`,
    'El copy está en voseo costarricense y listo para publicar.',
  ];

  const resolutionOpts: { value: '1K' | '2K'; label: string; desc: string }[] = [
    { value: '2K', label: '2K · 1080×1350', desc: 'Calidad máxima' },
    { value: '1K', label: '1K · 540×675', desc: 'Calidad feed IG' },
  ];

  const modeOpts: { value: 'standard' | 'batch'; label: string; desc: string }[] = [
    { value: 'standard', label: 'Standard', desc: '15–45 seg, precio normal' },
    { value: 'batch', label: 'Batch', desc: '~2× más lento, 50% más barato' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(20px)' }}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl overflow-hidden"
        style={{
          padding: '1rem',
          background: 'rgba(5,7,20,0.98)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}
            >
              <AlertTriangle size={17} style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-white">Generar imágenes del carrusel</p>
              <p className="text-[12px] text-white/35">Este paso tiene costo real.</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-white/25 hover:text-white/55 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-6">
          {/* Cost summary */}
          <div
            className="rounded-xl p-5"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] text-white/45">Post: <strong className="text-white/70">{draft.title}</strong></span>
              <span
                className="text-[18px] font-bold"
                style={{ color: '#3B82F6' }}
              >
                ${costUsd.toFixed(3)}
              </span>
            </div>
            <div className="flex flex-col gap-2 text-[12px] text-white/35">
              <div className="flex justify-between">
                <span>Claude API (copy)</span>
                <span>$0.050</span>
              </div>
              <div className="flex justify-between">
                <span>Nano Banana (1 background)</span>
                <span>${mode === 'batch' ? '0.055' : '0.110'}</span>
              </div>
              <div className="flex justify-between">
                <span>Satori text overlay ({n} slides)</span>
                <span style={{ color: '#34d399' }}>$0.000</span>
              </div>
            </div>
          </div>

          {/* Resolution */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
              Resolución
            </p>
            <div className="grid grid-cols-2 gap-2">
              {resolutionOpts.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={resolution === opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  onClick={() => setResolution(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Mode */}
          <div >
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
              Modo de generación
            </p>
            <div className="grid grid-cols-2 gap-2">
              {modeOpts.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={mode === opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  onClick={() => setMode(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-1">
              Checklist pre-generación
            </p>
            {checkItems.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleCheck(i)}
                className="flex items-start gap-3 text-left py-1"
              >
                {checks[i] ? (
                  <CheckSquare size={15} style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }} />
                ) : (
                  <Square size={15} className="text-white/20 flex-shrink-0 mt-px" />
                )}
                <span className={`text-[12.5px] leading-relaxed transition-colors ${checks[i] ? 'text-white/60' : 'text-white/30'}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-[13px] text-white/35 hover:text-white/55 transition-colors"
              style={{
                padding: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(costUsd, resolution, mode)}
              disabled={!allChecked}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                padding: '0.75rem',
                background: allChecked
                  ? 'linear-gradient(135deg, #2d5ec7 0%, #4a7fff 100%)'
                  : 'rgba(255,255,255,0.05)',
                boxShadow: allChecked ? '0 8px 24px rgba(59,111,217,0.35)' : 'none',
              }}
            >
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.07] transition-opacity" />
              <Zap size={15} />
              Generar · ${costUsd.toFixed(3)}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OptionButton({
  selected, label, desc, onClick,
}: {
  selected: boolean; label: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl p-3 text-left transition-all duration-150"
      style={{
        padding: '0.5rem',
        background: selected ? 'rgba(59,111,217,0.12)' : 'rgba(255,255,255,0.03)',
        border: selected ? '1px solid rgba(80,137,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <p className={`text-[13px] font-bold ${selected ? 'text-white' : 'text-white/40'}`}>{label}</p>
      <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
    </button>
  );
}
