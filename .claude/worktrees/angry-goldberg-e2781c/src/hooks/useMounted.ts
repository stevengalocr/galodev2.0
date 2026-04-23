/**
 * useMounted Hook
 *
 * Utility hook to track component mount state.
 * Useful for avoiding hydration mismatches in client components.
 */

"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the component has mounted on the client.
 * Use this to conditionally render client-only content.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
