/**
 * Environment Variables Validation
 *
 * Uses Zod to validate all environment variables at runtime.
 * In build time, we skip validation if variables are not set.
 */

import { z } from 'zod';

/**
 * Schema for server-side environment variables.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

/**
 * Schema for client-side environment variables.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
  }),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

/**
 * Combined schema for all environment variables.
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema);

type EnvType = z.infer<typeof envSchema>;

/**
 * Check if we're in the build phase (no Supabase needed for static pages)
 */
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Default env values for build phase
 */
const buildPhaseEnv: EnvType = {
  NODE_ENV: 'production',
  NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-key',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
};

/**
 * Parse and validate environment variables.
 */
function validateEnv(): EnvType {
  // During build, use placeholder values if env vars are not set
  if (isBuildPhase && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠ Using placeholder env values for build phase');
    return buildPhaseEnv;
  }

  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables. Check your .env.local file.');
  }

  return parsed.data;
}

/**
 * Validated environment variables.
 * Import this instead of using process.env directly.
 */
export const env = validateEnv();

/**
 * Type-safe access to environment variables.
 */
export type Env = z.infer<typeof envSchema>;
