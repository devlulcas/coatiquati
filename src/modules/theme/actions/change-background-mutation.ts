'use server';

import { fail, ok, type Ok, type Result } from '@/shared/lib/result';
import { cookies } from 'next/headers';
import { BACKGROUND_COOKIE_NAME, VALID_BACKGROUNDS, type Background } from '../constants/theme-keys';

export async function setBackgroundMutation(background: Background): Promise<Result<string>> {
  const isValidBackground = VALID_BACKGROUNDS.includes(background);

  if (!isValidBackground) {
    return fail('Tema inválido');
  }

  const jar = cookies()
  jar.set(BACKGROUND_COOKIE_NAME, background, {
    sameSite: 'lax',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    path: '/',
  });

  return ok(background);
}

export async function getBackgroundQuery(): Promise<Ok<Background>> {
  const background = (cookies().get(BACKGROUND_COOKIE_NAME)?.value || 'dark') as Background;
  return ok(VALID_BACKGROUNDS.includes(background) ? background : 'blob');
}
