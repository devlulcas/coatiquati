import { makeCookieName } from "@/shared/lib/string-builder";

export const THEME_COOKIE_NAME = makeCookieName('theme');

export const VALID_THEMES = ['dark', 'light'] as const;

export const FONT_COOKIE_NAME = makeCookieName('font');

export const VALID_FONTS = ['common', 'dyslexic'] as const;

export type Theme = typeof VALID_THEMES[number];

export type Font = typeof VALID_FONTS[number];
