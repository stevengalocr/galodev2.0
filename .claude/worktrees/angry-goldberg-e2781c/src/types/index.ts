/**
 * Global Type Definitions
 *
 * Central location for shared types used across the application.
 */

/**
 * API Response wrapper type for consistent response structure.
 */
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

/**
 * Pagination parameters for list queries.
 */
export type PaginationParams = {
  page: number;
  limit: number;
};

/**
 * Paginated response type.
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Action result type for server actions.
 */
export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};
