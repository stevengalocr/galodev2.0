/**
 * Global Type Definitions
 *
 * Central location for shared types used across the application.
 */

/**
 * Supabase Database Types
 *
 * Generate these types from your Supabase project:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 *
 * For now, we use a minimal placeholder that allows the app to compile.
 */
export type Database = {
  public: {
    Tables: {
      // Add your table types here after generating from Supabase
      // Example:
      // profiles: {
      //   Row: { id: string; username: string; created_at: string };
      //   Insert: { id: string; username?: string };
      //   Update: { id?: string; username?: string };
      // };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

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
