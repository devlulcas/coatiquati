'use server';

import { type Result } from '@/shared/lib/result';
import { redirect } from 'next/navigation';
import { invalidateSession } from '../services/auth';
import { deleteSessionTokenCookie, validateRequest } from '../services/next';

export async function logoutMutation(): Promise<Result> {
  const session = await validateRequest();

  if (session.data) {
    await invalidateSession(session.data.sessionId);
  }

  await deleteSessionTokenCookie();

  redirect('/sign-in');
}
