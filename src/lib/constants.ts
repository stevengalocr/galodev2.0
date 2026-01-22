/**
 * Application Constants
 *
 * Immutable values used throughout the application.
 * Keep this file free of any logic or imports.
 */

/**
 * Route paths for the application.
 */
export const ROUTES = {
  // Public routes
  HOME: "/",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Protected routes
  DASHBOARD: "/dashboard",

  // API routes
  API: {
    AUTH_CALLBACK: "/api/auth/callback",
    HEALTH: "/api/health",
  },
} as const;

/**
 * Cookie names used in the application.
 */
export const COOKIES = {
  SUPABASE_AUTH: "sb-auth-token",
} as const;

/**
 * HTTP status codes.
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error messages.
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to access this resource.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_NOT_FOUND: "User not found.",
  EMAIL_IN_USE: "This email is already registered.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;
