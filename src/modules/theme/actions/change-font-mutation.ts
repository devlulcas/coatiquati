'use server';

import { fail, ok, type Ok, type Result } from '@/shared/lib/result';
import { cookies } from 'next/headers';
import { FONT_COOKIE_NAME, VALID_FONTS, type Font } from '../constants/theme-keys';

export async function setFontMutation(font: Font): Promise<Result<string>> {
  const isValidFont = VALID_FONTS.includes(font);

  if (!isValidFont) {
    return fail('Fonte inválida');
  }

  const jar = cookies();
  jar.set(FONT_COOKIE_NAME, font, {
    sameSite: 'lax',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    path: '/',
  });

  return ok(font);
}

export async function getFontQuery(): Promise<Ok<Font>> {
  const font = (cookies().get(FONT_COOKIE_NAME)?.value || 'dark') as Font;
  return ok(font === 'dyslexic' ? 'dyslexic' : 'common');
}
