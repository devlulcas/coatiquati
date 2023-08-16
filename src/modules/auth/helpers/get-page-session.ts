import { auth } from '@/modules/auth/services/lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';

/**
 * This allows you share the session across pages and layouts, making it possible to validate the request in
 * multiple layouts and page files without making unnecessary database calls.
 *
 * @see {@link https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app} for more information.
 */
export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  });
  return authRequest.validate();
});
