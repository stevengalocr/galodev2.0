/**
 * Register Page
 */

import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-sm">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <RegisterForm />
      </main>
    </div>
  );
}
