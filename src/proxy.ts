/**
 * Root Proxy
 *
 * Handles session refresh and route protection.
 * Runs on every request to keep auth state synchronized.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession, matchesPath, PUBLIC_ROUTES, AUTH_ROUTES } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session (refresh token if needed)
  const { user, supabaseResponse } = await updateSession(request);

  // Allow public routes
  if (matchesPath(pathname, PUBLIC_ROUTES)) {
    // Redirect authenticated users away from auth pages
    if (user && matchesPath(pathname, AUTH_ROUTES)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return supabaseResponse;
  }

  // Protect private routes - redirect to login if not authenticated
  if (!user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

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
