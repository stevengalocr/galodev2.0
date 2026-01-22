/**
 * User Types
 *
 * Type definitions for user-related operations.
 */

import type { User } from "@supabase/supabase-js";

/**
 * User profile stored in the database.
 */
export type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Extended user with profile data.
 */
export type ExtendedUser = User & {
  profile?: UserProfile;
};

/**
 * User update payload.
 */
export type UpdateUserData = {
  fullName?: string;
  avatarUrl?: string;
};
