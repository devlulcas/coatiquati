'use server';

import { fail, type Result } from '@/shared/lib/result';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, validateRequest } from '../services/lucia';

export async function logoutMutation(): Promise<Result> {
  const { session } = await validateRequest();
  if (!session) {
    return fail('Sessão inválida');
  }

  await auth.invalidateSession(session.id);

  const sessionCookie = auth.createBlankSessionCookie();
  const jar = await cookies();
  jar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/sign-in');
}
