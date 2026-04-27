import type { GenerateCopyRequest } from './types';
import { PILAR_LABELS, ESTRUCTURA_LABELS, PUBLICO_LABELS, OBJETIVO_LABELS } from './constants';

// ── Post Único — completely separate prompt ───────────────────────────────────
// Claude acts as both content strategist AND art director for Imagen.
// Output: 1 variant + a pixel-perfect Imagen prompt that renders everything.

export function buildPostUnicoPrompt(req: GenerateCopyRequest): string {
  const pilarLabel = PILAR_LABELS[req.pilar];
  const now = new Date();
  const currentDate = now.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' });

  const topicInstruction = req.idea?.trim()
    ? `Tema propuesto: "${req.idea.trim()}". Desarrollalo con el mejor ángulo visual posible usando datos de ${currentYear}.`
    : `Ningún tema propuesto. Usá tu conocimiento más reciente (hasta tu fecha de corte) para elegir el tema MÁS TRENDING en el mundo de ${pilarLabel} para un developer fullstack hispano. Buscá: lanzamientos de ${currentYear}, debates virales recientes, estadísticas actuales, cambios de industria de los últimos meses, errores comunes que están discutiendo ahora.`;

  const contextInstruction = req.datosDuros?.trim()
    ? `Contexto adicional: ${req.datosDuros.trim()}`
    : `Sin datos extra proporcionados. IMPORTANTE: usá los datos más recientes que tenés disponibles. Si no estás seguro de un dato específico de ${currentYear}, preferí datos verificables de tu entrenamiento antes que inventar. Nombrá versiones exactas, precios actuales, fechas reales.`;

  return `Sos el art director y content strategist de GaloDev (galodev.com, Instagram dev account, Costa Rica).

⚠️ FECHA ACTUAL: ${currentDate}
Todos los datos, versiones, precios y estadísticas que uses DEBEN ser de ${currentYear} o lo más recientes posible.
NUNCA pongas "${currentYear - 1}" o años anteriores en títulos o contenido — estamos en ${currentMonth}.
Si el tema menciona "2025" o años pasados, actualizalo a ${currentYear}.

MISIÓN: Crear UN post único de Instagram — UNA SOLA IMAGEN — que sea viral y educativo.
La imagen la genera Google Imagen 3 (Nano Banana) con el prompt que vos escribís.
Vos sos el director creativo: Claude diseña todo, Imagen lo renderiza.

MARCA:
- GaloDev.com — Steven Galo, fullstack costarricense freelance
- Paleta: #020617 (dark navy) · #3B82F6 (electric blue) · #FFFFFF · #94A3B8
- Colores de logos tech con sus colores oficiales se permiten como acento
- Estilo: Vercel / Linear / Stripe dark editorial — premium, limpio, viral
- Voz en caption: voseo costarricense ("tenés", "sabés", "fijate")

BRIEF:
- Pilar: ${pilarLabel}
- ${topicInstruction}
- ${contextInstruction}

FORMATOS IDEALES para post único (elegí el que más impacte según el tema):
• Timeline: "Evolución de X — de YYYY a ${currentYear}"
• Top-N lista: "Las 10 herramientas que todo dev debe conocer en ${currentYear}"
• Comparativa tabla: "ChatGPT vs Claude — diferencias reales en ${currentYear}" (tabla visual)
• Estadísticas: "El estado de X en ${currentYear} — 5 datos que te van a sorprender"
• Roadmap: "Ruta para convertirte en dev fullstack — los pasos reales"
• Checklist: "Dev junior vs senior — qué domina cada uno (checklist visual)"
• Ranking visual: "Los frameworks más usados en ${currentYear} (con %)"

REGLAS DEL imagenPrompt — CRÍTICO:
El imagenPrompt es el prompt que va directo a Google Imagen. Debe ser ULTRA DETALLADO porque Imagen va a renderizar la imagen COMPLETA incluyendo TODO el texto visible.

El imagenPrompt debe incluir:
1. Formato: "Portrait Instagram post 1080x1080px, premium dark design"
2. Fondo: descripción exacta del gradiente/patrón oscuro
3. Layout: posición y tamaño relativo de cada sección
4. CADA PIEZA DE TEXTO que debe aparecer (copiala textualmente del contenido que generaste)
5. Tipografía: "Bold white sans-serif [tamaño aproximado], [color]"
6. Elementos visuales: iconos, barras de progreso, timeline lines, tablas, divisores
7. Watermark obligatorio: "Small 'GaloDev.com' text bottom-right in #3B82F6 blue"
8. Estilo final: "Vercel dark mode, premium infographic, viral tech design"

RESPONDE ÚNICAMENTE con este JSON (sin markdown, sin texto extra):
{
  "variant": {
    "variantLabel": "A",
    "approach": "descripción del concepto en 1 línea",
    "title": "título del post",
    "slides": [
      {
        "number": 1,
        "type": "hook",
        "titulo": "título principal que aparece en la imagen",
        "subtitulo": "subtítulo si aplica",
        "cuerpo": "todo el contenido textual listado (lo que va en la imagen)",
        "snippet": "",
        "notaDiseno": "brief de diseño en inglés, 1-2 líneas",
        "imagenPrompt": "<<PROMPT ULTRA DETALLADO PARA GOOGLE IMAGEN — mínimo 200 palabras — incluye TODO el texto que debe aparecer en la imagen>>"
      }
    ],
    "caption": "caption completa para Instagram con emojis y voseo tico (máx 2200 chars)",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"],
    "cta": "llamada a la acción específica",
    "hookAlternativo": "versión alternativa del hook para probar"
  }
}`;
}

const BRAND_VOICE = `
MARCA Y VOZ:
- Cuenta: GaloDev.com / Instagram @GaloDevCR (Steven Galo, desarrollador fullstack costarricense freelance)
- VOZ OBLIGATORIA: voseo costarricense — "tenés", "sabés", "podés", "mandame", "fijate", "ojo con"
- NUNCA usar: "tienes", "sabes", "puedes", "tienes que", "deberías"
- Tono: directo, honesto, como hablarle a un colega desarrollador
- 80% valor educativo, 20% conversión
- Un slide = una sola idea. Si no cabe, va en otro slide
- Texto por slide: máximo 25 palabras en título+subtítulo+cuerpo combinados
- AÑO ACTUAL: ${new Date().getFullYear()} — todos los datos y estadísticas deben ser de este año
`.trim();

const SLIDE_COUNT_LOGIC = `
CANTIDAD DE SLIDES (4 a 8, decidís según densidad):
- 4 slides: idea simple, 1 insight fuerte, mito rápido
- 5 slides: lista corta de 3 items, comparativa básica
- 6 slides: tutorial estándar, lista media de 4 items
- 7 slides: tutorial con código, lista de 5 items
- 8 slides: tutorial completo con código y stats, case study profundo
Slide 1 siempre = Hook. Slide final siempre = CTA.
`.trim();

export function buildCopyPrompt(req: GenerateCopyRequest): string {
  const pilarLabel = PILAR_LABELS[req.pilar];
  const estructuraLabel = req.estructura ? ESTRUCTURA_LABELS[req.estructura] : 'Libre';
  const publicoLabel = PUBLICO_LABELS[req.publico];
  const objetivoLabel = OBJETIVO_LABELS[req.objetivo];

  const slidesInstruction =
    req.postType === 'post_unico'
      ? 'Usá EXACTAMENTE 1 slide. Este es un POST ÚNICO (no carrusel). Solo una imagen, un mensaje poderoso.'
      : req.postType === 'story'
      ? 'Usá entre 3 y 5 slides. Son Stories verticales de Instagram, breves y directas.'
      : req.postType === 'anuncio'
      ? 'Usá EXACTAMENTE 5 slides enfocados a conversión.'
      : req.slides === 'auto'
      ? 'Decidí vos cuántos slides necesita el contenido (entre 4 y 8).'
      : `Usá exactamente ${req.slides} slides.`;

  return `Sos el asistente de contenido de @GaloDevCR en Instagram.

${BRAND_VOICE}

${SLIDE_COUNT_LOGIC}

BRIEF DEL POST:
- Tipo: ${req.postType}
- Pilar de contenido: ${pilarLabel}
- Estructura narrativa: ${estructuraLabel}
- Idea central: ${req.idea?.trim() ? req.idea.trim() : `[SIN IDEA DEFINIDA — buscá el tema más relevante y trending en este momento dentro del pilar "${pilarLabel}" para una cuenta de desarrollo web freelance costarricense. Investigá tendencias actuales, errores comunes, herramientas populares o debates recientes de la comunidad dev que generen mucho engagement. Elegí el mejor ángulo y desarrollalo.]`}
- Público objetivo: ${publicoLabel}
- Objetivo (qué queremos que hagan): ${objetivoLabel}
${req.datosDuros?.trim() ? `- Datos duros / contexto extra: ${req.datosDuros}` : '- Contexto extra: [No proporcionado — usá tu conocimiento actualizado para agregar estadísticas reales, nombres de herramientas relevantes y ejemplos concretos que enriquezcan el contenido.]'}

SLIDES: ${slidesInstruction}

${req.excludePrevious?.length ? `IMPORTANTE: Ya generaste versiones anteriores de este post. Esta vez generá ángulos completamente diferentes.` : ''}

INSTRUCCIÓN PRINCIPAL:
Generame DOS variantes completas del post en formato JSON. Las variantes deben ser claramente distintas:
- Variante A: más técnica/racional
- Variante B: más emocional/storytelling

Para cada slide generá también un "notaDiseno" en inglés (1-2 líneas) describiendo qué elementos visuales debería tener ese slide (iconos, logos tech, figuras abstractas, mood). Esta nota la usará Nano Banana para generar el artwork visual.

REGLAS CRÍTICAS DE FORMATO:
- NUNCA uses null en ningún campo. Usa "" (string vacío) si un campo opcional no aplica.
- El campo "type" de cada slide DEBE ser exactamente uno de: "hook", "roadmap", "body", "summary", "cta"
- El slide 1 siempre type:"hook". El último slide siempre type:"cta".
- "hashtags" máximo 10 items, sin el símbolo #
- Todos los campos string deben ser strings, nunca null ni undefined

RESPONDE ÚNICAMENTE con este JSON (sin markdown, sin explicaciones):
{
  "variants": [
    {
      "variantLabel": "A",
      "approach": "descripción del ángulo en 1 línea",
      "title": "título del post",
      "slides": [
        {
          "number": 1,
          "type": "hook",
          "titulo": "texto del título del slide",
          "subtitulo": "texto del subtítulo (opcional)",
          "cuerpo": "cuerpo del slide (opcional, máx 20 palabras)",
          "snippet": "código si aplica (opcional)",
          "notaDiseno": "visual design note in English for Nano Banana"
        }
      ],
      "caption": "caption completa para Instagram (máx 2200 chars)",
      "hashtags": ["hashtag1", "hashtag2"],
      "cta": "llamada a la acción específica",
      "hookAlternativo": "versión alternativa del hook del slide 1"
    },
    {
      "variantLabel": "B",
      ... (misma estructura)
    }
  ]
}`;
}

export function buildSlideRepairPrompt(slide: object, issue: string): string {
  return `El siguiente slide de un post de Instagram de @GaloDevCR tiene un problema: ${issue}

Slide actual:
${JSON.stringify(slide, null, 2)}

Corregí el slide manteniendo el mismo tema pero solucionando el problema.
Usá voseo costarricense. Máximo 25 palabras en título+cuerpo.
Respondé SOLO con el JSON del slide corregido.`;
}
