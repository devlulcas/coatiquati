import { makeCookieName } from "@/shared/lib/string-builder";

export const THEME_COOKIE_NAME = makeCookieName('theme');
export const VALID_THEMES = ['dark', 'light'] as const;
export type Theme = typeof VALID_THEMES[number];

export const FONT_COOKIE_NAME = makeCookieName('font');
export const VALID_FONTS = ['common', 'dyslexic'] as const;
export type Font = typeof VALID_FONTS[number];

export const BACKGROUND_COOKIE_NAME = makeCookieName('background');
export const VALID_BACKGROUNDS = ['blob', 'blob-grid', 'solid'] as const;
export const BackgroundConfig = {
  blob: {
    wrapperBlur: 'xl',
    label: 'Blobs',
  },
  'blob-grid': {
    wrapperBlur: 'none',
    label: 'Blobs Grid',
  },
  solid: {
    wrapperBlur: 'none',
    label: 'Sólido',
  },
} as const;
export type Background = typeof VALID_BACKGROUNDS[number];
