/**
 * Supabase Browser Client
 *
 * Creates a Supabase client for use in Client Components.
 * This client uses the browser's built-in fetch and localStorage.
 *
 * IMPORTANT: Only use this in components with 'use client' directive.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

/**
 * Get or create a Supabase client for browser-side operations.
 * Uses a singleton pattern to avoid creating multiple instances.
 */
export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return browserClient;
}

/**
 * Alias for consistency with server client naming.
 */
export const getSupabaseBrowserClient = createClient;
