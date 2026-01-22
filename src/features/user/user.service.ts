/**
 * User Service
 *
 * Server-side user operations.
 * Profile management and user data access.
 */

import { createClient } from '@/lib/supabase/server';
import type { UpdateUserData, UserProfile } from './user.types';

/**
 * Get user profile from the database.
 *
 * Note: This assumes you have a 'profiles' table in Supabase.
 * Uncomment and adjust the query to match your schema.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  // Uncomment when you have a profiles table:
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', userId)
  //   .single();
  //
  // if (error || !data) {
  //   return null;
  // }
  //
  // return {
  //   id: data.id,
  //   email: data.email,
  //   fullName: data.full_name,
  //   avatarUrl: data.avatar_url,
  //   createdAt: data.created_at,
  //   updatedAt: data.updated_at,
  // };

  // Placeholder implementation using auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: user.user_metadata?.full_name as string | undefined,
    avatarUrl: user.user_metadata?.avatar_url as string | undefined,
    createdAt: user.created_at,
    updatedAt: user.updated_at ?? user.created_at,
  };
}

/**
 * Update user profile.
 *
 * Note: Uncomment database operations when you have a profiles table.
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Uncomment when you have a profiles table:
  // const { error } = await supabase
  //   .from('profiles')
  //   .update({
  //     full_name: data.fullName,
  //     avatar_url: data.avatarUrl,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq('id', userId);
  //
  // if (error) {
  //   return { success: false, error: error.message };
  // }

  // Update auth user metadata instead
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.fullName,
      avatar_url: data.avatarUrl,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get current authenticated user with metadata.
 */
export async function getCurrentUserWithMetadata() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: user.user_metadata?.full_name as string | undefined,
    avatarUrl: user.user_metadata?.avatar_url as string | undefined,
    createdAt: user.created_at,
  };
}
