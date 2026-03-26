'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Database,
  LayoutGrid,
  Server,
  BrainCircuit,
  Rocket,
  Briefcase,
  Terminal,
  ShieldCheck,
  MapPin,
  GraduationCap,
  Languages,
  Building2,
  Layers,
  Code2,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/providers/language.provider';

/* ─── Dynamic year helpers ──────────────────────────────────────────── */
const START_YEAR = 2022;
const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - START_YEAR;

/* ─── Animation presets ─────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const, delay },
});

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true },
};

const cardFade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

/* ─── Section ───────────────────────────────────────────────────────── */

export default function PortfolioSection() {
  const { t } = useLanguage();
  const p = t.portfolio;

  /* ─── Translated data arrays ─────────────────────────────────────── */

  const skills = [
    {
      icon: LayoutGrid,
      category: p.skills.frontend,
      items: ['Angular', 'React', 'HTML5', 'CSS3', 'Tailwind'],
    },
    { icon: Server, category: p.skills.backend, items: ['Go', 'C#', '.NET'] },
    { icon: Database, category: p.skills.database, items: ['SQL Server', 'PostgreSQL'] },
    {
      icon: Terminal,
      category: p.skills.toolsDevops,
      items: ['Git', 'Docker', 'Azure', 'Postman', 'IIS'],
    },
    {
      icon: BrainCircuit,
      category: p.skills.aiModern,
      items: ['AI Automation', 'Next.js', 'APIs REST'],
    },
    { icon: ShieldCheck, category: p.skills.methodologies, items: ['Scrum', 'Agile'] },
  ];

  const experience = [
    {
      role: p.experience.entries[0].role,
      company: p.experience.entries[0].company,
      period: p.experience.entries[0].period,
      accentColor: 'var(--color-primary-400)',
      accentRgb: '80,137,255',
      description: p.experience.entries[0].description,
    },
    {
      role: p.experience.entries[1].role,
      company: p.experience.entries[1].company,
      period: p.experience.entries[1].period,
      accentColor: '#a78bfa',
      accentRgb: '167,139,250',
      description: p.experience.entries[1].description,
    },
    {
      role: p.experience.entries[2].role,
      company: p.experience.entries[2].company,
      period: p.experience.entries[2].period,
      accentColor: '#34d399',
      accentRgb: '52,211,153',
      description: p.experience.entries[2].description,
    },
  ];

  const projects = [
    {
      icon: Building2,
      title: p.projects.entries[0].title,
      tech: p.projects.entries[0].tech,
      description: p.projects.entries[0].description,
    },
    {
      icon: Code2,
      title: p.projects.entries[1].title,
      tech: p.projects.entries[1].tech,
      description: p.projects.entries[1].description,
    },
    {
      icon: Layers,
      title: p.projects.entries[2].title,
      tech: p.projects.entries[2].tech,
      description: p.projects.entries[2].description,
    },
  ];

  return (
    <section
      id="portfolio"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        marginTop: '55px',
        padding: '45px',
      }}
    >
      {/* Ambient glows that blend with the global space bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(59,111,217,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 35% at 85% 80%, rgba(124,59,217,0.05) 0%, transparent 60%)',
          ].join(','),
        }}
      />

      <div className="relative z-10 mx-auto px-8 sm:px-12 md:px-16 lg:px-20">
        {/* ── Header ── */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col items-center text-center mb-16 sm:mb-24"
          style={{ marginBottom: '15px' }}
        >
          <span
            className="inline-flex items-center justify-center px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-[2rem] text-[11px] sm:text-[13px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white mb-8 border border-white bg-transparent w-max max-w-full text-center"
            style={{ padding: '10px' }}
          >
            {p.badge}
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Steven Tercero Galo
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
            {p.subtitle}
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          {/* ══ LEFT — Profile Card ══ */}
          <motion.aside
            {...fadeUp(0.1)}
            className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0 lg:sticky lg:top-28"
          >
            <div
              className="w-full rounded-3xl overflow-hidden"
              style={{
                padding: '12px',
                background: 'rgba(8, 11, 24, 0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 28px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Avatar section */}
              <div
                className="flex flex-col items-center text-center pt-14 pb-10 px-10"
                style={{
                  background:
                    'linear-gradient(175deg, rgba(59,111,217,0.14) 0%, rgba(124,59,217,0.07) 50%, transparent 100%)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="w-32 h-32 rounded-full overflow-hidden mb-6"
                  style={{
                    border: '2px solid rgba(80,137,255,0.4)',
                    boxShadow: '0 0 24px rgba(80,137,255,0.25)',
                    background: 'rgba(8,11,24,0.6)',
                  }}
                >
                  <Image
                    src="/images/steven-perfil.png"
                    alt="Steven Tercero Galo"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl sm:text-[26px] tracking-tight font-bold text-white mb-2">
                  Steven Tercero Galo
                </h3>
                <p
                  className="text-base font-semibold mb-3"
                  style={{ color: 'var(--color-primary-400)' }}
                >
                  {p.role}
                </p>
                <div className="flex justify-center items-center gap-1.5 text-sm text-gray-500">
                  <MapPin
                    size={13}
                    className="flex-shrink-0"
                    style={{ color: 'var(--color-primary-500)' }}
                  />
                  <span>San José, Costa Rica</span>
                </div>
              </div>

              {/* Bio */}
              <div
                className="px-8 py-8 flex flex-col items-center text-center"
                style={{
                  marginTop: '15px',
                  marginBottom: '15px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed max-w-[280px]">
                  {p.bio.prefix}{' '}
                  <span className="text-white font-bold">
                    {yearsOfExperience} {p.bio.yearsExperience}
                  </span>{' '}
                  {p.bio.suffix}
                </p>
              </div>

              {/* Contact links */}
              <div
                className="px-6 sm:px-8 py-8"
                style={{
                  marginTop: '15px',
                  marginBottom: '15px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="grid grid-cols-2 gap-3 w-full">
                  <ContactRow
                    icon={Mail}
                    href="mailto:stevengalocr@gmail.com"
                    label="stevengalocr@gmail.com"
                  />
                  <ContactRow
                    icon={Phone}
                    href="https://wa.me/50670460002"
                    label="+506 7046 0002"
                  />
                  <ContactRow
                    icon={Linkedin}
                    href="https://www.linkedin.com/in/steven-tercero-galo-94a6621bb"
                    label="/in/steven-tercero-galo-94a6621bb"
                  />
                  <ContactRow
                    icon={Github}
                    href="https://github.com/stevengalocr"
                    label="stevengalocr"
                  />
                </div>
              </div>

              {/* Education */}
              <div
                className="px-10 py-8"
                style={{
                  marginTop: '15px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <MiniLabel icon={GraduationCap} text={p.education.label} />
                <div className="mt-4 space-y-3.5">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.education.university}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.education.degree}</p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--color-primary-300)' }}
                    >
                      {p.education.currentDegree}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{p.education.currentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="px-10 py-8" style={{ marginTop: '15px' }}>
                <MiniLabel icon={Languages} text={p.languages.label} />
                <div
                  className="mt-4 flex flex-col gap-3"
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                >
                  <LangBar
                    lang={p.languages.spanish}
                    pct={100}
                    label={p.languages.spanishLevel}
                    color="var(--color-primary-500)"
                  />
                  <LangBar
                    lang={p.languages.english}
                    pct={56}
                    label={p.languages.englishLevel}
                    color="#8bcffaff"
                  />
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ══ RIGHT — Content ══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 w-full max-w-full">
            {/* Stack Técnico */}
            <motion.div {...fadeUp(0.15)} className="w-full min-w-0 max-w-full">
              <Panel>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <PanelHeader icon={Terminal} title={p.skills.title} />
                  <div className="sm:hidden flex items-center gap-1.5 text-blue-400 opacity-80 animate-pulse pb-2">
                    <span className="text-[11px] font-medium tracking-wide">{p.swipeHint}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="flex w-full max-w-[85vw] mx-auto overflow-x-auto snap-x snap-mandatory gap-6 pb-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {Array.from({ length: 2 }).map((_, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="snap-center shrink-0 w-[75vw] max-w-[320px] sm:w-auto sm:max-w-none flex flex-col gap-6 sm:contents"
                    >
                      {skills.slice(groupIndex * 3, groupIndex * 3 + 3).map((s, i) => (
                        <motion.div key={i} variants={cardFade} custom={groupIndex * 3 + i}>
                          <SkillCard {...s} />
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </Panel>
            </motion.div>

            {/* Experiencia */}
            <motion.div {...fadeUp(0.2)} className="w-full min-w-0 max-w-full">
              <Panel accent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <PanelHeader icon={Briefcase} title={p.experience.title} />
                  <div className="sm:hidden flex items-center gap-1.5 text-blue-400 opacity-80 animate-pulse pb-2">
                    <span className="text-[11px] font-medium tracking-wide">{p.swipeHint}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
                {/* Experiencia Carousel/Grid */}
                <div className="mt-4 sm:mt-8 relative w-full min-w-0 max-w-full">
                  <div
                    className="flex w-full max-w-[85vw] mx-auto overflow-x-auto snap-x snap-mandatory gap-4 pb-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {experience.map((exp, i) => (
                      <div
                        key={i}
                        className="snap-center shrink-0 w-[75vw] max-w-[320px] sm:w-auto sm:max-w-none flex flex-col"
                      >
                        <ExpCard {...exp} />
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </motion.div>

            {/* Proyectos */}
            <motion.div {...fadeUp(0.25)} className="w-full min-w-0 max-w-full">
              <Panel>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <PanelHeader icon={Rocket} title={p.projects.title} />
                  <div className="sm:hidden flex items-center gap-1.5 text-blue-400 opacity-80 animate-pulse pb-2">
                    <span className="text-[11px] font-medium tracking-wide">{p.swipeHint}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="flex w-full max-w-[85vw] mx-auto overflow-x-auto snap-x snap-mandatory gap-4 pb-4 mt-4 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {projects.map((pr, i) => (
                    <motion.div
                      key={i}
                      variants={cardFade}
                      custom={i}
                      className="snap-center shrink-0 w-[75vw] max-w-[320px] sm:w-auto sm:max-w-none flex flex-col"
                    >
                      <ProjectCard {...pr} />
                    </motion.div>
                  ))}
                </motion.div>
              </Panel>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Atoms ─────────────────────────────────────────────────────────── */

function MiniLabel({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={12} style={{ color: 'var(--color-primary-500)' }} />
      <span
        className="text-[10px] font-bold tracking-[0.18em] uppercase"
        style={{ color: 'var(--color-space-400)' }}
      >
        {text}
      </span>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  const isEmail = href.includes('mailto:');
  const displayLabel = isEmail
    ? 'Email'
    : href.includes('wa.me')
      ? 'WhatsApp'
      : href.includes('linkedin')
        ? 'LinkedIn'
        : 'GitHub';

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center gap-3 transition-all duration-300 w-full p-4 rounded-[1.25rem]"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(59,111,217,0.09)';
        el.style.border = '1px solid rgba(80,137,255,0.22)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.015)';
        el.style.border = '1px solid rgba(255,255,255,0.05)';
        el.style.transform = 'translateY(0)';
      }}
    >
      <span
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          background: 'rgba(59,111,217,0.08)',
          border: '1px solid rgba(80,137,255,0.15)',
        }}
      >
        <Icon size={18} style={{ color: 'var(--color-primary-400)' }} />
      </span>
      <span className="text-[11px] font-bold text-gray-400 group-hover:text-primary-300 transition-colors truncate w-full text-center uppercase tracking-widest">
        {displayLabel}
      </span>
    </a>
  );
}

function LangBar({
  lang,
  pct,
  label,
  color,
}: {
  lang: string;
  pct: number;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-300">{lang}</span>
        <span className="text-[10px] text-gray-600">{label}</span>
      </div>
      <div
        className="w-full h-[3px] rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeOut' as const, delay: 0.4 }}
        />
      </div>
    </div>
  );
}

function Panel({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className="rounded-[2rem] p-[25px] sm:p-10 lg:p-12 w-full min-w-0"
      style={{
        padding: '12px',
        background: accent
          ? 'linear-gradient(145deg, rgba(59,111,217,0.06) 0%, rgba(8,11,24,0.88) 60%)'
          : 'rgba(8,11,24,0.82)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 20px 56px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-2" style={{ marginBottom: '12px' }}>
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{
          marginTop: '15px',
          background: 'rgba(59,111,217,0.12)',
          border: '1px solid rgba(80,137,255,0.25)',
        }}
      >
        <Icon size={22} style={{ color: 'var(--color-primary-400)' }} />
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
  );
}

function SkillCard({
  icon: Icon,
  category,
  items,
}: {
  icon: React.ElementType;
  category: string;
  items: string[];
}) {
  return (
    <div
      className="rounded-[1.25rem] p-[20px] sm:p-7 h-full transition-all duration-300 cursor-default"
      style={{
        padding: '12px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(59,111,217,0.09)';
        el.style.border = '1px solid rgba(80,137,255,0.25)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.025)';
        el.style.border = '1px solid rgba(255,255,255,0.08)';
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <Icon size={16} style={{ color: 'var(--color-primary-400)' }} />
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
          {category}
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5" style={{ marginTop: '10px' }}>
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[13px] px-[15px] py-[6px] rounded-[10px] text-gray-300"
            style={{
              padding: '5px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExpCard({
  role,
  company,
  period,
  description,
  accentColor,
  accentRgb,
}: {
  role: string;
  company: string;
  period: string;
  description: string;
  accentColor: string;
  accentRgb: string;
}) {
  return (
    <div className="group h-full flex flex-col">
      <div
        className="rounded-[1.25rem] p-[20px] sm:p-8 transition-all duration-300 h-full flex flex-col"
        style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = `rgba(${accentRgb},0.07)`;
          el.style.border = `1px solid rgba(${accentRgb},0.3)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(255,255,255,0.025)';
          el.style.border = '1px solid rgba(255,255,255,0.08)';
        }}
      >
        <div className="flex flex-col gap-3 mb-4">
          <h4 className="text-xl font-bold text-white tracking-wide">{role}</h4>
          <span
            className="text-xs sm:text-sm font-semibold rounded-full self-start flex-shrink-0"
            style={{
              padding: '6px 14px',
              background: `rgba(${accentRgb},0.12)`,
              color: accentColor,
              border: `1px solid rgba(${accentRgb},0.25)`,
            }}
          >
            {company === 'Core-Code' ? '' : period}
          </span>
        </div>
        <p
          className="text-base font-semibold mb-3"
          style={{ marginTop: '10px', color: accentColor }}
        >
          {company}
        </p>
        <p className="text-[14px] sm:text-[15px] text-gray-400 leading-relaxed mt-auto flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProjectCard({
  icon: Icon,
  title,
  tech,
  description,
}: {
  icon: React.ElementType;
  title: string;
  tech: string;
  description: string;
}) {
  return (
    <div
      className="group rounded-[1.25rem] p-[20px] sm:p-8 h-full flex flex-col transition-all duration-300 cursor-default"
      style={{
        marginTop: '10px',
        padding: '12px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(59,111,217,0.09)';
        el.style.border = '1px solid rgba(80,137,255,0.25)';
        el.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.025)';
        el.style.border = '1px solid rgba(255,255,255,0.08)';
        el.style.transform = 'translateY(0)';
      }}
    >
      <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug">
        {title}
      </h4>
      <span
        className="text-[11px] font-bold tracking-[0.15em] uppercase mb-4 block"
        style={{ color: 'var(--color-primary-600)' }}
      >
        {tech}
      </span>
      <p
        className="text-[15px] text-gray-400 leading-relaxed mt-auto"
        style={{ marginTop: '10px' }}
      >
        {description}
      </p>
    </div>
  );
}
