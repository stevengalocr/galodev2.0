/**
 * Dashboard Page (Protected)
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/auth.service';
import { logoutAction } from '@/features/auth/auth.actions';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-lg">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="w-full p-6 rounded-lg border border-black/[.08] dark:border-white/[.145]">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-black/50 dark:text-white/50">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-black/50 dark:text-white/50">User ID</dt>
              <dd className="font-mono text-xs break-all">{user.id}</dd>
            </div>
            <div>
              <dt className="text-black/50 dark:text-white/50">Last Sign In</dt>
              <dd>
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="h-10 px-6 rounded-full border border-black/[.08] dark:border-white/[.145] font-medium hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            Logout
          </button>
        </form>
      </main>
    </div>
  );
}
