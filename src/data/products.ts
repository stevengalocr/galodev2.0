import { IconType } from 'react-icons';
import {
  FiLayout,
  FiShoppingBag,
  FiMessageSquare,
  FiTrendingUp,
  FiBriefcase,
} from 'react-icons/fi';

export interface Product {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  mainBenefit: string;
  priceLabel?: string;
  icon: IconType;
  features: string[];
  image: string;
  ctaText: string;
  shortTitle: string;
  imageScale?: number;
}

export const products: Product[] = [
  {
    id: 'landing-page',
    title: 'Landing Pages',
    description: 'Páginas optimizadas para convertir visitas en clientes reales.',
    targetAudience: 'Servicios y Marcas Personales',
    mainBenefit: 'Conversión de leads',
    icon: FiLayout,
    features: [
      'Diseño orientado a conversión',
      'Captura de leads',
      'Integración con WhatsApp',
      'Carga ultra rápida',
    ],
    image: '/products/landing_brand.png',
    ctaText: 'Ver cómo funciona',
    shortTitle: 'Páginas Web',
    imageScale: 1.5,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce a Medida',
    description: 'Tiendas online rápidas, escalables y personalizadas para tu marca.',
    targetAudience: 'Marcas y Tiendas',
    mainBenefit: 'Ventas sin límites',
    icon: FiShoppingBag,
    features: [
      'Checkout optimizado',
      'Panel de gestión simple',
      'Integraciones de pago',
      'Preparado para crecer',
    ],
    image: '/products/ecommerce_min.png',
    ctaText: 'Explorar solución',
    shortTitle: 'E-commerce',
  },
  {
    id: 'chatbot-ai',
    title: 'Chatbot de Ventas con IA',
    description: 'Automatiza respuestas, vende 24/7 y no pierdas más clientes.',
    targetAudience: 'Atención 24/7',
    mainBenefit: 'Automatización total',
    icon: FiMessageSquare,
    features: [
      'Atención automática',
      'Calificación de leads',
      'Respuestas inteligentes',
      'Integrable con web y WhatsApp',
    ],
    image: '/products/chatbot_brand.png',
    ctaText: 'Ver demo conceptual',
    shortTitle: 'Chatbots',
    imageScale: 1.3,
  },
  {
    id: 'mini-crm',
    title: 'Sistemas Completos',
    description: 'Controla leads, clientes y ventas desde un solo lugar.',
    targetAudience: 'Equipos de ventas',
    mainBenefit: 'Gestión eficiente',
    icon: FiTrendingUp,
    features: [
      'Gestión de oportunidades',
      'Estados de venta',
      'Dashboard claro',
      'Ideal para equipos pequeños',
    ],
    image: '/products/crm_min.png',
    ctaText: 'Conocer el sistema',
    shortTitle: 'Sistemas',
  },
  {
    id: 'all-in-one',
    title: 'Plataforma Todo-en-Uno para Emprendedores',
    description: 'La solución completa para negocios que quieren escalar.',
    targetAudience: 'Negocios en expansión',
    mainBenefit: 'Ecosistema completo',
    icon: FiBriefcase,
    features: [
      'Landing + ventas',
      'Automatización',
      'Chatbot',
      'Panel de control',
      'Infraestructura escalable',
    ],
    image: '/products/allinone_min.jpg',
    ctaText: 'Ver solución premium',
    shortTitle: 'Todo en Uno',
  },
];
