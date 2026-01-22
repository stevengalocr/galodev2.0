/**
 * Supabase Server Client
 *
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Uses cookies for session management.
 *
 * IMPORTANT: Create a new client for each request to avoid shared state.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types";

/**
 * Create a Supabase client for server-side operations.
 * Must be called fresh for each request - do not cache or reuse.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

/**
 * Alias for clearer naming in imports.
 */
export const getSupabaseServerClient = createClient;
