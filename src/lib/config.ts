/**
 * Application Configuration
 *
 * Centralized configuration derived from environment variables.
 * Use this for application-wide settings.
 */

import { env } from "./env";

export const config = {
  /**
   * Supabase configuration
   */
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  /**
   * Application URLs
   */
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    name: "NextJS Supabase Template",
  },

  /**
   * Environment flags
   */
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isStaging: env.NODE_ENV === "staging",

  /**
   * Auth configuration
   */
  auth: {
    redirects: {
      afterLogin: "/dashboard",
      afterLogout: "/",
      afterSignup: "/dashboard",
    },
    providers: {
      // Enable/disable OAuth providers here
      google: false,
      github: false,
    },
  },
} as const;

export type Config = typeof config;
