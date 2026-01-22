/**
 * Design Tokens
 *
 * Centralized design system with cosmic/space theme.
 * All colors, typography, and spacing values defined here.
 *
 * Color palette extracted from space nebula imagery:
 * - Deep cosmic blacks and dark blues
 * - Nebula blues and purples
 * - Star whites and accent glows
 */

export const colors = {
  // ===========================================
  // Core Brand Colors
  // ===========================================

  // Primary - Deep Space Blues
  primary: {
    50: '#e8f0ff',
    100: '#c5d9ff',
    200: '#9ebfff',
    300: '#74a4ff',
    400: '#5089ff',
    500: '#3b6fd9', // Main primary
    600: '#2d58b3',
    700: '#1f428c',
    800: '#142d66',
    900: '#0a1940',
  },

  // Secondary - Nebula Purple
  secondary: {
    50: '#f3e8ff',
    100: '#e0c5ff',
    200: '#c99eff',
    300: '#b174ff',
    400: '#9a50ff',
    500: '#7c3bd9', // Main secondary
    600: '#612db3',
    700: '#471f8c',
    800: '#2e1466',
    900: '#180a40',
  },

  // Accent - Starlight/Glow
  accent: {
    50: '#f0f8ff',
    100: '#e0f0ff',
    200: '#bae0ff',
    300: '#8aceff',
    400: '#5abaff',
    500: '#38a3e6', // Main accent
    600: '#2b82b8',
    700: '#1f628a',
    800: '#14425c',
    900: '#0a212e',
  },

  // ===========================================
  // Neutral Colors - Space Blacks
  // ===========================================

  space: {
    50: '#f5f5f7',
    100: '#e5e5e9',
    200: '#c8c8d0',
    300: '#a8a8b4',
    400: '#888898',
    500: '#68687c',
    600: '#505062',
    700: '#383848',
    800: '#1a1a2e', // Main dark background
    900: '#0d0d1a', // Deepest black
    950: '#06060d', // True cosmic black
  },

  // ===========================================
  // Semantic Colors
  // ===========================================

  success: {
    light: '#4ade80',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },

  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },

  error: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },

  info: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },

  // ===========================================
  // Special Effects
  // ===========================================

  glow: {
    blue: 'rgba(59, 111, 217, 0.5)',
    purple: 'rgba(124, 59, 217, 0.5)',
    white: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), system-ui, sans-serif',
    mono: 'var(--font-geist-mono), monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Spacing
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

// Border Radius
export const radius = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.625rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(59, 111, 217, 0.3)',
  'glow-lg': '0 0 40px rgba(59, 111, 217, 0.4)',
} as const;

// Z-Index
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Export all tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  zIndex,
} as const;

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Shadows = typeof shadows;
export type ZIndex = typeof zIndex;
