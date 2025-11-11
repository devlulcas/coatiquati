import { auth } from '@/modules/auth/lib/auth';
import type { User } from 'better-auth';

export async function canViewAll(
  currentUser: User | null,
  target: 'trail' | 'topic' | 'content'
) {
  if (!currentUser) return false;

  const canSeeDraft = await auth.api.userHasPermission({
    body: {
      userId: currentUser.id,
      permission: {
        [target]: ['view_all'],
      },
    },
  });

  return canSeeDraft.success;
}
