/**
 * Root Proxy
 *
 * Modified for Design Mode:
 * - Allows access to ALL routes without login.
 * - Session refresh is kept active but doesn't block access.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  // Update session (refresh token if needed) - keeping this so auth state still works if needed
  const { supabaseResponse } = await updateSession(request);

  // DESIGN MODE: Always allow access
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
