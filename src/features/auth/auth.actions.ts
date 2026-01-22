/**
 * Auth Server Actions
 *
 * Server actions for authentication operations.
 * These can be called directly from Client Components.
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { signInWithEmail, signUpWithEmail, signOut as signOutService } from './auth.service';
import { loginSchema, registerSchema } from './auth.schemas';
import type { ActionResult } from '@/types';

/**
 * Server action for user login.
 */
export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate input
  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  // Attempt login
  const result = await signInWithEmail(validation.data);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  // Revalidate and redirect
  revalidatePath('/', 'layout');
  redirect(result.redirectTo || '/dashboard');
}

/**
 * Server action for user registration.
 */
export async function registerAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    fullName: (formData.get('fullName') as string) || undefined,
  };

  // Validate input
  const validation = registerSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  // Attempt registration
  const result = await signUpWithEmail({
    email: validation.data.email,
    password: validation.data.password,
    fullName: validation.data.fullName,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  // Revalidate and redirect
  revalidatePath('/', 'layout');
  redirect(result.redirectTo || '/dashboard');
}

/**
 * Server action for user logout.
 */
export async function logoutAction(): Promise<void> {
  await signOutService();

  // Revalidate and redirect
  revalidatePath('/', 'layout');
  redirect('/');
}
