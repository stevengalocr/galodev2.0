/**
 * Logout Button Component
 * 
 * Client component for logging out users.
 */

'use client';

import { logoutAction } from '@/features/auth/auth.actions';
import { Button } from '@/components/ui';

/**
 * Button that triggers the logout server action.
 */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm">
        Logout
      </Button>
    </form>
  );
}
