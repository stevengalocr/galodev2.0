/**
 * Auth Types
 *
 * Type definitions for authentication-related operations.
 */

import type { User, Session } from "@supabase/supabase-js";

/**
 * Login credentials for email/password authentication.
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Registration data for new user signup.
 */
export type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
};

/**
 * Auth state returned from Supabase.
 */
export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

/**
 * OAuth provider types supported by the application.
 */
export type OAuthProvider = "google" | "github" | "discord";

/**
 * Result of an authentication operation.
 */
export type AuthResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};
