'use server';

import { fail, ok, type Ok, type Result } from '@/shared/lib/result';
import { cookies } from 'next/headers';
import { THEME_COOKIE_NAME, VALID_THEMES, type Theme } from '../constants/theme-keys';

export async function setThemeMutation(theme: Theme): Promise<Result<string>> {
  const isValidTheme = VALID_THEMES.includes(theme);

  if (!isValidTheme) {
    return fail('Tema inválido');
  }

  const jar = cookies()
  jar.set(THEME_COOKIE_NAME, theme, {
    sameSite: 'lax',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    path: '/',
  });

  return ok(theme);
}

export async function getThemeQuery(): Promise<Ok<Theme>> {
  const theme = (cookies().get(THEME_COOKIE_NAME)?.value || 'dark') as Theme;
  return ok(theme === 'light' ? 'light' : 'dark');
}
