'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, PenSquare, LogOut, Sparkles, Search, FileText, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

import type {
  FlowStep,
  PostType,
  CopyDraft,
  CopyDraftPair,
  ProgressEvent,
} from '@/lib/crear-post/types';
import type { BriefData } from '@/components/herramientas/crear-post/StepBrief';

import StepTypeSelector from '@/components/herramientas/crear-post/StepTypeSelector';
import StepBrief from '@/components/herramientas/crear-post/StepBrief';
import StepCopyReview from '@/components/herramientas/crear-post/StepCopyReview';
import StepApprovalGate from '@/components/herramientas/crear-post/StepApprovalGate';
import StepProgress from '@/components/herramientas/crear-post/StepProgress';
import StepFinalPackage from '@/components/herramientas/crear-post/StepFinalPackage';
import StepPostUnicoPromptReview from '@/components/herramientas/crear-post/StepPostUnicoPromptReview';

// ── Animated copy-generation loading screen ───────────────────────────────────

const COPY_STEPS_CAROUSEL = [
  { icon: Search,       label: 'Analizando tu brief…' },
  { icon: Sparkles,     label: 'Investigando tendencias del momento…' },
  { icon: FileText,     label: 'Redactando variante A (técnica)…' },
  { icon: FileText,     label: 'Redactando variante B (storytelling)…' },
  { icon: CheckCircle2, label: 'Revisando voseo costarricense…' },
];

const COPY_STEPS_POST_UNICO = [
  { icon: Search,       label: 'Investigando el tema más trending…' },
  { icon: Sparkles,     label: 'Eligiendo el mejor formato visual…' },
  { icon: FileText,     label: 'Diseñando layout y copy completo…' },
  { icon: Sparkles,     label: 'Escribiendo prompt detallado para Imagen…' },
  { icon: CheckCircle2, label: 'Finalizando diseño de la imagen…' },
];

function StepGeneratingCopy({ hasIdea, isPostUnico }: { hasIdea: boolean; isPostUnico: boolean }) {
  const COPY_STEPS = isPostUnico ? COPY_STEPS_POST_UNICO : COPY_STEPS_CAROUSEL;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timings = [1800, 3500, 6000, 9000]; // ms at which each step advances
    const timers = timings.map((delay, i) =>
      setTimeout(() => setActiveIndex(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="generating_copy"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="w-full max-w-[500px] mx-auto"
    >
      {/* Card */}
      <div
        className="relative rounded-[2rem] overflow-hidden"
        style={{
          background: 'rgba(5,7,20,0.96)',
          border: '1px solid rgba(80,137,255,0.22)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div style={{padding:'2rem'}} className="p-10 flex flex-col items-center gap-8">
          {/* Spinner ring */}
          <div className="relative w-16 h-16">
            <svg className="absolute inset-0 animate-spin" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="rgba(59,130,246,0.12)" strokeWidth="4" />
              <path
                d="M32 4 A28 28 0 0 1 60 32"
                stroke="url(#grad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={22} className="text-blue-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-[18px] font-bold text-white mb-1">Claude está trabajando</h3>
            <p className="text-[13px] text-white/35">
              {isPostUnico
                ? (hasIdea ? 'Diseñando tu post único con Imagen…' : 'Investigando tendencias y diseñando tu post…')
                : (hasIdea ? 'Generando 2 variantes de copy para tu post…' : 'Buscando el mejor tema y generando copy…')}
            </p>
          </div>

          {/* Steps */}
          <div className="w-full flex flex-col gap-3">
            {COPY_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isDone = i < activeIndex;
              const isActive = i === activeIndex;
              const isPending = i > activeIndex;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  {/* Icon status */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isDone
                        ? 'rgba(52,211,153,0.15)'
                        : isActive
                        ? 'rgba(59,130,246,0.18)'
                        : 'rgba(255,255,255,0.04)',
                      border: isDone
                        ? '1px solid rgba(52,211,153,0.3)'
                        : isActive
                        ? '1px solid rgba(80,137,255,0.4)'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 size={13} style={{ color: '#34d399' }} />
                    ) : (
                      <Icon
                        size={12}
                        style={{
                          color: isActive ? '#7baeff' : 'rgba(255,255,255,0.2)',
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-[13px] transition-all duration-300"
                    style={{
                      color: isDone
                        ? 'rgba(52,211,153,0.8)'
                        : isActive
                        ? '#fff'
                        : 'rgba(255,255,255,0.2)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>

                  {/* Active pulse */}
                  {isActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                      style={{ background: '#3B82F6' }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Cost note */}
          <p className="text-[11px] text-white/18 tracking-wide">
            ~$0.04 · 15–30 segundos
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CrearPostPage() {
  const router = useRouter();

  // ── Flow state ───────────────────────────────────────────────────────────
  const [step, setStep] = useState<FlowStep>('type_selection');
  const [postType, setPostType] = useState<PostType | null>(null);
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [copyPair, setCopyPair] = useState<CopyDraftPair | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<CopyDraft | null>(null);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const [finalImages, setFinalImages] = useState<string[]>([]);
  const [totalCostUsd, setTotalCostUsd] = useState(0);
  const [jobId] = useState(() => crypto.randomUUID());
  const [hasIdea, setHasIdea] = useState(false);

  // ── Loading/error ────────────────────────────────────────────────────────
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [showGate, setShowGate] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleTypeSelect = (type: PostType) => {
    setPostType(type);
    setStep('briefing');
  };

  const handleBriefSubmit = async (data: BriefData) => {
    setBriefData(data);
    await generateCopy(data);
  };

  const generateCopy = useCallback(
    async (data: BriefData, excludePrevious?: string[]) => {
      setCopyError(null);
      setHasIdea(!!data.idea?.trim());
      setStep('generating_copy');

      try {
        const res = await fetch('/api/herramientas/crear-post/copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postType: data.postType,
            pilar: data.pilar,
            estructura: data.estructura,
            idea: data.idea,
            publico: data.publico,
            objetivo: data.objetivo,
            datosDuros: data.datosDuros,
            slides: data.slides,
            excludePrevious,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? 'Error generando copy');
        }

        setCopyPair(json.data as CopyDraftPair);
        if (json.postUnico) {
          // Post único: single variant, skip review — go straight to approval gate.
          // Use 'approval_gate' step so StepCopyReview does NOT render behind the modal
          // (avoids duplicate key "A" since both variant slots hold the same draft).
          setSelectedDraft((json.data as CopyDraftPair).variants[0]);
          setStep('approval_gate');
          setShowGate(true);
        } else {
          setStep('review_copy');
        }
      } catch (err) {
        setCopyError(err instanceof Error ? err.message : 'Error desconocido');
        setStep('briefing');
      } finally {
        setIsRegenerating(false);
      }
    },
    []
  );

  const handleRegenerate = async () => {
    if (!briefData || !copyPair) return;
    setIsRegenerating(true);
    await generateCopy(briefData, [copyPair.draftId]);
  };

  const handleDraftSelect = (draft: CopyDraft) => {
    setSelectedDraft(draft);
    setShowGate(true);
  };

  const handleGateConfirm = async (
    costUsd: number,
    resolution: '1K' | '2K',
    mode: 'standard' | 'batch'
  ) => {
    if (!selectedDraft || !briefData) return;
    setShowGate(false);
    setStep('generating_images');
    setProgressEvents([]);

    try {
      const res = await fetch('/api/herramientas/crear-post/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          draftId: copyPair?.draftId ?? crypto.randomUUID(),
          draft: selectedDraft,
          postType: postType ?? 'carrusel',
          pilar: briefData.pilar,
          estructura: briefData.estructura,
          resolution,
          mode,
          confirmedCostUsd: costUsd,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Error iniciando generación de imágenes');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const event = JSON.parse(line.slice(6)) as ProgressEvent;
            setProgressEvents((prev) => [...prev, event]);

            if (event.type === 'job_done') {
              setFinalImages(event.imageUrls);
              setTotalCostUsd(event.totalCostUsd);
              setStep('final_package');
            }

            if (event.type === 'job_aborted') {
              setCopyError(`Generación abortada: ${event.reason}`);
              // Post único: go back to prompt review so they can edit & retry without losing the copy.
              // Carousel: go back to copy review.
              setStep(postType === 'post_unico' ? 'approval_gate' : 'review_copy');
            }
          } catch {
            // Malformed SSE line — ignore
          }
        }
      }
    } catch (err) {
      setCopyError(err instanceof Error ? err.message : 'Error en generación de imágenes');
      setStep(postType === 'post_unico' ? 'approval_gate' : 'review_copy');
    }
  };

  const handleRestart = () => {
    setStep('type_selection');
    setPostType(null);
    setBriefData(null);
    setCopyPair(null);
    setSelectedDraft(null);
    setProgressEvents([]);
    setFinalImages([]);
    setTotalCostUsd(0);
    setCopyError(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/herramientas/login');
    router.refresh();
  };

  // ── Derived ──────────────────────────────────────────────────────────────

  const currentCostSoFar = progressEvents
    .filter((e) => e.type === 'background_done')
    .reduce((s, e) => s + (e as Extract<ProgressEvent, { type: 'background_done' }>).costUsd, 0);

  const totalSlides = selectedDraft?.slides.length ?? 0;

  // Progress dots — only for main user-facing steps
  const DOT_STEPS: FlowStep[] = ['type_selection', 'briefing', 'review_copy', 'final_package'];
  const dotIndex = DOT_STEPS.indexOf(step);

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ fontFamily: 'var(--font-outfit, sans-serif)' }}
    >
      {/* ── Background ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/galodev_tools_bg.png"
          alt="Background"
          fill
          className="object-cover opacity-70 mix-blend-screen"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[#020412]/80 backdrop-blur-[2px]" />
      </div>

      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 900, height: 600, top: '-10%', left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(59,111,217,0.1) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between"
        style={{
          padding: '0 24px',
          height: '64px',
          background: 'rgba(2,4,18,0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Breadcrumb */}
        <Link href="/herramientas" className="flex items-center gap-2 group">
          <span className="text-[14px] font-semibold text-white/70 group-hover:text-white transition-colors">
            Herramientas
          </span>
          <ChevronRight size={13} className="text-white/20" />
          <div className="flex items-center gap-1.5">
            <PenSquare size={11} style={{ color: '#a78bfa' }} />
            <span className="text-[13px] text-white/40 font-medium">Crear Post</span>
          </div>
        </Link>

        {/* Step dots */}
        <div className="hidden sm:flex items-center gap-2">
          {DOT_STEPS.map((s, i) => (
            <div
              key={s}
              className="rounded-full transition-all duration-400"
              style={{
                width: dotIndex === i ? 20 : 7,
                height: 7,
                background:
                  dotIndex === i
                    ? '#3B82F6'
                    : dotIndex > i
                    ? 'rgba(59,130,246,0.4)'
                    : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[12.5px] text-white/30 hover:text-white/65 transition-all duration-200 group px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.border = '1px solid transparent';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <LogOut size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          <span className="hidden sm:block">Salir</span>
        </button>
      </header>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <main style={{ marginTop: '6rem' }} className="relative z-10 flex flex-col items-center pt-[100px] pb-24 px-4 sm:px-6">

        {/* Hero — solo en paso 1 */}
        <AnimatePresence>
          {step === 'type_selection' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <div
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-5"
                style={{ padding: '0.25rem 0.75rem', background: 'rgba(59,111,217,0.1)', border: '1px solid rgba(80,137,255,0.22)' }}
              >
                <PenSquare size={10} style={{ color: '#7baeff' }} />
                <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase" style={{ color: '#7baeff' }}>
                  Herramienta IA
                </span>
              </div>
              <h1 className="text-[36px] sm:text-[44px] font-bold text-white leading-tight tracking-tight mb-3">
                Crear Post
              </h1>
              <p className="text-[15px] text-white/35 leading-relaxed max-w-[480px]">
                De la idea al carrusel listo para publicar — con Claude + diseño GaloDev.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        <AnimatePresence>
          {copyError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-[680px] mb-6 px-4 py-3.5 rounded-xl text-[13px]"
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.22)',
                color: '#fca5a5',
              }}
            >
              {copyError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step content (all inside one AnimatePresence) ─────────── */}
        <AnimatePresence mode="wait">
          {step === 'type_selection' && (
            <StepTypeSelector key="type" onSelect={handleTypeSelect} />
          )}

          {step === 'briefing' && postType && (
            <StepBrief
              key="brief"
              postType={postType}
              onSubmit={handleBriefSubmit}
              onBack={() => setStep('type_selection')}
            />
          )}

          {step === 'generating_copy' && (
            <StepGeneratingCopy key="generating_copy" hasIdea={hasIdea} isPostUnico={postType === 'post_unico'} />
          )}

          {step === 'review_copy' && copyPair && briefData && (
            <StepCopyReview
              key="review"
              pair={copyPair}
              pilar={briefData.pilar}
              onSelect={handleDraftSelect}
              onRegenerate={handleRegenerate}
              onBack={() => setStep('briefing')}
              isRegenerating={isRegenerating}
            />
          )}

          {/* Post único: editable prompt review before opening the gate */}
          {step === 'approval_gate' && selectedDraft && postType === 'post_unico' && (
            <StepPostUnicoPromptReview
              key="prompt_review"
              draft={selectedDraft}
              onConfirm={(editedPrompt) => {
                // Patch the imagenPrompt in the selected draft with the user's edited version
                setSelectedDraft({
                  ...selectedDraft,
                  slides: selectedDraft.slides.map((s, i) =>
                    i === 0 ? { ...s, imagenPrompt: editedPrompt } : s
                  ),
                });
                setShowGate(true);
              }}
              onRegenerate={() => {
                if (briefData) generateCopy(briefData);
              }}
              onBack={() => setStep('briefing')}
            />
          )}

          {step === 'generating_images' && (
            <StepProgress
              key="progress"
              events={progressEvents}
              totalSlides={totalSlides}
              totalCostSoFar={currentCostSoFar}
            />
          )}

          {step === 'final_package' && selectedDraft && (
            <StepFinalPackage
              key="final"
              draft={selectedDraft}
              imageUrls={finalImages}
              totalCostUsd={totalCostUsd}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ── Approval Gate Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showGate && selectedDraft && (
          <StepApprovalGate
            draft={selectedDraft}
            onConfirm={handleGateConfirm}
            onCancel={() => {
              setShowGate(false);
              // For post_unico the step is 'approval_gate' — closing the gate reveals the prompt review.
              // For carousel the step is already 'review_copy' so StepCopyReview reappears automatically.
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
