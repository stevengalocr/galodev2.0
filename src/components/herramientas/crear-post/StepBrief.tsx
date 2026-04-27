'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronLeft, Sparkles } from 'lucide-react';
import type { PostType, Pilar, Estructura } from '@/lib/crear-post/types';
import type { Publico, Objetivo } from '@/lib/crear-post/types';
import {
  PILAR_LABELS,
  ESTRUCTURA_LABELS,
  ESTRUCTURA_DESCRIPTIONS,
  POST_TYPE_CONFIGS,
} from '@/lib/crear-post/constants';

export interface BriefData {
  postType: PostType;
  pilar: Pilar;
  estructura?: Estructura;
  idea?: string;
  publico: Publico;
  objetivo: Objetivo;
  datosDuros?: string;
  slides: 'auto' | 4 | 5 | 6 | 7 | 8;
}

interface Props {
  postType: PostType;
  onSubmit: (data: BriefData) => void;
  onBack: () => void;
}

const PILARES: Pilar[] = ['tutorial_tecnico', 'freelance', 'herramientas', 'proyecto'];
const ESTRUCTURAS: Estructura[] = [
  'lista_numerica', 'comparativa', 'storytelling', 'stack', 'case_study', 'error_mito',
];

const selectBase: React.CSSProperties = {
  width: '100%',
  height: '52px',
  borderRadius: '14px',
  padding: '0 16px',
  fontSize: '14px',
  color: 'white',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  colorScheme: 'dark',
  transition: 'all 0.2s ease',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const inputFocusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.border = '1px solid rgba(80,137,255,0.55)';
    e.currentTarget.style.background = 'rgba(59,111,217,0.09)';
    e.currentTarget.style.boxShadow = '0 0 20px rgba(59,111,217,0.15)';
  },
  onBlur: (e: React.FocusEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    e.currentTarget.style.boxShadow = 'none';
  },
};

export default function StepBrief({ postType, onSubmit, onBack }: Props) {
  const config = POST_TYPE_CONFIGS.find((c) => c.id === postType)!;
  const needsEstructura = config.needsEstructura;

  const [pilar, setPilar] = useState<Pilar | ''>('');
  const [estructura, setEstructura] = useState<Estructura | ''>('');
  const [idea, setIdea] = useState('');
  const [datosDuros, setDatosDuros] = useState('');
  const [slides, setSlides] = useState<'auto' | 4 | 5 | 6 | 7 | 8>('auto');

  // Solo pilar (y estructura si aplica) son obligatorios
  const isValid = pilar && (!needsEstructura || estructura);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      postType,
      pilar: pilar as Pilar,
      estructura: estructura ? (estructura as Estructura) : undefined,
      idea: idea.trim() || undefined,
      // Hardcoded — GaloDev siempre apunta a guardados/compartidos y público tech mixto
      publico: 'mixto',
      objetivo: 'guardados',
      datosDuros: datosDuros.trim() || undefined,
      slides,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="w-full max-w-[640px] mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(130,175,255,0.6)' }}>
          Paso 2 de 4 · {config.title}
        </p>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-white leading-tight tracking-tight mb-2">
          Contame la idea
        </h2>
        <p className="text-[14px] text-white/35">Solo los campos con * son obligatorios.</p>
      </div>

      {/* Card */}
      <div
        className="relative rounded-[2rem] overflow-hidden"
        style={{
          background: 'rgba(5,7,20,0.96)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }} className="flex flex-col gap-6">

          {/* ── Pilar ───────────────────────────────────────────────── */}
          <Field label="Pilar de contenido" required>
            <SelectWrap>
              <select
                value={pilar}
                onChange={(e) => setPilar(e.target.value as Pilar)}
                style={selectBase}
                {...inputFocusHandlers}
              >
                <option value="">Seleccioná un pilar…</option>
                {PILARES.map((p) => (
                  <option key={p} value={p}>{PILAR_LABELS[p]}</option>
                ))}
              </select>
            </SelectWrap>
          </Field>

          {/* ── Estructura ──────────────────────────────────────────── */}
          {needsEstructura && (
            <Field label="Estructura narrativa" required>
              <SelectWrap>
                <select
                  value={estructura}
                  onChange={(e) => setEstructura(e.target.value as Estructura)}
                  style={selectBase}
                  {...inputFocusHandlers}
                >
                  <option value="">Elegí la estructura…</option>
                  {ESTRUCTURAS.map((e) => (
                    <option key={e} value={e}>
                      {ESTRUCTURA_LABELS[e]} — {ESTRUCTURA_DESCRIPTIONS[e]}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
          )}

          <Divider />

          {/* ── Contenido opcional ──────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Contenido
            </p>
            <span
              className="flex items-center gap-1 text-[10.5px] font-semibold rounded-full"
              style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.22)',
                color: '#c4b5fd',
              }}
            >
              <Sparkles size={9} />
              Claude investiga si no ponés nada
            </span>
          </div>

          {/* Idea central */}
          <Field label="Idea central del post" hint={idea ? `${idea.length}/280` : 'Opcional'}>
            <textarea
              rows={3}
              maxLength={280}
              placeholder="Ej: Por qué Next.js 15 cambió cómo estructuro mis proyectos… (si dejás vacío, Claude busca el tema trending del momento)"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              style={{ ...selectBase, height: 'auto', padding: '14px 16px', resize: 'none', lineHeight: '1.5' }}
              {...inputFocusHandlers}
            />
          </Field>

          {/* Datos duros */}
          <Field label="Datos duros / contexto extra" hint="Opcional">
            <textarea
              rows={2}
              maxLength={2000}
              placeholder="Estadísticas, herramientas específicas, snippets… (si no ponés nada, Claude investiga contexto relevante)"
              value={datosDuros}
              onChange={(e) => setDatosDuros(e.target.value)}
              style={{ ...selectBase, height: 'auto', padding: '14px 16px', resize: 'none', lineHeight: '1.5' }}
              {...inputFocusHandlers}
            />
          </Field>

          {/* Slides (solo carrusel) */}
          {postType === 'carrusel' && (
            <>
              <Divider />
              <Field label="Cantidad de slides">
                <div className="flex gap-2 flex-wrap">
                  {(['auto', 4, 5, 6, 7, 8] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSlides(v)}
                      className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 cursor-pointer"
                      style={{
                        background: slides === v ? 'rgba(59,111,217,0.2)' : 'rgba(255,255,255,0.04)',
                        border: slides === v ? '1px solid rgba(80,137,255,0.45)' : '1px solid rgba(255,255,255,0.08)',
                        color: slides === v ? '#7baeff' : 'rgba(255,255,255,0.35)',
                        boxShadow: slides === v ? '0 0 16px rgba(59,111,217,0.18)' : 'none',
                      }}
                    >
                      {v === 'auto' ? 'Auto' : v}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/20 mt-1.5">
                  Auto → Claude elige la cantidad ideal según el tema
                </p>
              </Field>
            </>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] text-white/40 hover:text-white/65 transition-colors cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <ChevronLeft size={15} />
              Volver
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 flex items-center justify-center gap-2.5 h-[56px] rounded-xl text-[15px] font-bold text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden cursor-pointer"
              style={{
                background: isValid
                  ? 'linear-gradient(135deg, #2d5ec7 0%, #4a7fff 60%, #5a8fff 100%)'
                  : 'rgba(255,255,255,0.05)',
                boxShadow: isValid ? '0 8px 30px rgba(59,111,217,0.35)' : 'none',
                border: isValid ? 'none' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.06] transition-opacity" />
              <Zap size={16} />
              Generar 2 variantes de copy
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />;
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-white/55">
          {label}
          {required && <span className="ml-1" style={{ color: '#5089ff' }}>*</span>}
        </label>
        {hint && <span className="text-[11px] text-white/22">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
