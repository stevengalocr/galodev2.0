'use client';

import Link from 'next/link';
import { ArrowRight, Download, QrCode, Link2, Palette, PenSquare } from 'lucide-react';
import { SiTiktok, SiInstagram } from 'react-icons/si';

const tools = [
  {
    href: '/herramientas/descargar',
    icon: Download,
    title: 'Descargador de Videos',
    description:
      'Descarga videos de TikTok sin marca de agua e Instagram Reels en HD. Rápido y gratis.',
    badge: 'Disponible',
    badgeActive: true,
    color: 'rgba(59,111,217,0.12)',
    borderColor: 'rgba(80,137,255,0.22)',
    iconColor: 'var(--color-primary-400, #5089ff)',
    tags: [
      { icon: SiTiktok, label: 'TikTok' },
      { icon: SiInstagram, label: 'Reels' },
    ],
  },
  {
    href: '/herramientas/crear-post',
    icon: PenSquare,
    title: 'Crear Post',
    description:
      'De la idea al carrusel de Instagram listo para publicar — con Claude AI + diseño GaloDev.',
    badge: 'Disponible',
    badgeActive: true,
    color: 'rgba(139,92,246,0.12)',
    borderColor: 'rgba(167,139,250,0.28)',
    iconColor: '#a78bfa',
    tags: [],
  },
  {
    href: null,
    icon: QrCode,
    title: 'Generador de QR',
    description: 'Genera códigos QR para URLs, texto o datos de contacto al instante.',
    badge: 'Próximamente',
    badgeActive: false,
    color: 'rgba(124,59,217,0.08)',
    borderColor: 'rgba(167,139,250,0.15)',
    iconColor: '#a78bfa',
    tags: [],
  },
  {
    href: null,
    icon: Link2,
    title: 'Acortador de URLs',
    description: 'Crea enlaces cortos personalizados y rastrea sus clics en tiempo real.',
    badge: 'Próximamente',
    badgeActive: false,
    color: 'rgba(52,211,153,0.06)',
    borderColor: 'rgba(52,211,153,0.15)',
    iconColor: '#34d399',
    tags: [],
  },
  {
    href: null,
    icon: Palette,
    title: 'Paleta de Colores',
    description: 'Genera paletas armoniosas y exporta en HEX, RGB o CSS variables.',
    badge: 'Próximamente',
    badgeActive: false,
    color: 'rgba(251,146,60,0.06)',
    borderColor: 'rgba(251,146,60,0.15)',
    iconColor: '#fb923c',
    tags: [],
  },
];

function ToolCard({
  tool,
}: {
  tool: (typeof tools)[0];
}) {
  const Icon = tool.icon;

  const baseStyle: React.CSSProperties = {
    background: 'rgba(8,11,24,0.65)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    transition: 'all 0.25s ease',
  };

  const content = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: tool.color, border: `1px solid ${tool.borderColor}` }}
        >
          <Icon size={20} style={{ color: tool.iconColor }} />
        </div>
        <div className="flex items-center gap-2">
          {tool.badgeActive && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#34d399' }}
            />
          )}
          <span
            className="text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full"
            style={{
              background: tool.badgeActive ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
              border: tool.badgeActive
                ? '1px solid rgba(52,211,153,0.25)'
                : '1px solid rgba(255,255,255,0.07)',
              color: tool.badgeActive ? '#34d399' : 'rgba(255,255,255,0.25)',
            }}
          >
            {tool.badge}
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold text-white mb-1.5">{tool.title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{tool.description}</p>

      {tool.tags.length > 0 && (
        <div className="flex items-center gap-2 mt-3">
          {tool.tags.map(({ icon: TagIcon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1 text-[11px] text-white/30 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TagIcon size={10} />
              {label}
            </span>
          ))}
        </div>
      )}

      {tool.badgeActive && (
        <div
          className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
          style={{ color: tool.iconColor }}
        >
          <span>Abrir herramienta</span>
          <ArrowRight size={13} />
        </div>
      )}
    </>
  );

  if (tool.href && tool.badgeActive) {
    return (
      <Link
        href={tool.href}
        className="rounded-2xl p-6 flex flex-col"
        style={baseStyle}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = tool.color;
          el.style.border = `1px solid ${tool.borderColor}`;
          el.style.transform = 'translateY(-3px)';
          el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(8,11,24,0.65)';
          el.style.border = '1px solid rgba(255,255,255,0.06)';
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl p-6 flex flex-col opacity-60" style={baseStyle}>
      {content}
    </div>
  );
}

export default function ToolsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tools.map((tool, i) => (
        <ToolCard key={i} tool={tool} />
      ))}
    </div>
  );
}
