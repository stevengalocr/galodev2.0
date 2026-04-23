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
  CONTACT: "/contacto",

  // API routes
  API: {
    SEND_EMAIL: "/api/send-email",
  },
} as const;

/**
 * Cookie names used in the application.
 */
export const COOKIES = {} as const;

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
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;
