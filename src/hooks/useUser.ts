/**
 * useUser Hook
 *
 * Client-side hook for accessing the current user.
 * Uses the Supabase provider context.
 */

"use client";

import { useSupabase } from "@/providers/supabase.provider";

/**
 * Hook to get the current authenticated user.
 * Returns user data, loading state, and authentication status.
 */
export function useUser() {
  const { user, session, isLoading } = useSupabase();

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !isLoading && !!user,
    isAnonymous: !isLoading && !user,
  };
}
