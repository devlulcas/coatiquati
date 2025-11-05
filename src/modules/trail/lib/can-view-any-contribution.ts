import { auth } from '@/modules/auth/lib/auth';
import type { User } from 'better-auth';

export async function canViewAllTrails(currentUser: User | null) {
  if (!currentUser) return false;

  const canSeeDraft = await auth.api.userHasPermission({
    body: {
      userId: currentUser.id,
      permission: {
        trail: ['view_all'],
      },
    },
  });

  return canSeeDraft.success;
}
