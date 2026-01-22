/**
 * Login Form Component
 */

'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/features/auth/auth.actions';
import type { ActionResult } from '@/types';

const initialState: ActionResult = { success: false };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full">
      {state.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-10 px-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="h-10 px-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-10 rounded-full bg-foreground text-background font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Loading...' : 'Login'}
      </button>

      <p className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="underline hover:no-underline">
          Register
        </Link>
      </p>
    </form>
  );
}
