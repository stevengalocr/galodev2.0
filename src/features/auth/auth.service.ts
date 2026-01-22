/**
 * Auth Service
 *
 * Server-side authentication operations.
 * All Supabase auth calls are isolated here for clean architecture.
 */

import { createClient } from "@/lib/supabase/server";
import type {
  LoginCredentials,
  RegisterData,
  AuthResult,
  OAuthProvider,
} from "./auth.types";
import { config } from "@/lib/config";
import { ROUTES } from "@/lib/constants";

/**
 * Sign in a user with email and password.
 */
export async function signInWithEmail(
  credentials: LoginCredentials,
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    redirectTo: config.auth.redirects.afterLogin,
  };
}

/**
 * Register a new user with email and password.
 */
export async function signUpWithEmail(
  data: Omit<RegisterData, "confirmPassword">,
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
      emailRedirectTo: `${config.app.url}${ROUTES.API.AUTH_CALLBACK}`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    redirectTo: config.auth.redirects.afterSignup,
  };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    redirectTo: config.auth.redirects.afterLogout,
  };
}

/**
 * Get OAuth sign-in URL for a provider.
 */
export async function getOAuthUrl(
  provider: OAuthProvider,
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${config.app.url}${ROUTES.API.AUTH_CALLBACK}`,
    },
  });

  if (error || !data.url) {
    return null;
  }

  return data.url;
}

/**
 * Get the current authenticated user.
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current session.
 */
export async function getSession() {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}
