'use server';

import { cookies } from 'next/headers';
import { auth, validateRequest } from '../services/lucia';
import { redirect } from 'next/navigation';
import { fail, type Result } from '@/shared/lib/result';

export async function logoutMutation(): Promise<Result> {
  const { session } = await validateRequest();
  if (!session) {
    return fail('Sessão inválida');
  }

  await auth.invalidateSession(session.id);

  const sessionCookie = auth.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/sign-in');
}
