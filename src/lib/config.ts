/**
 * Application Configuration
 *
 * Centralized configuration derived from environment variables.
 * Use this for application-wide settings.
 */

import { env } from "./env";

export const config = {
  /**
   * Application URLs
   */
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    name: "GaloDev Portfolio",
  },

  /**
   * Environment flags
   */
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isStaging: env.NODE_ENV === "staging",

} as const;

export type Config = typeof config;
