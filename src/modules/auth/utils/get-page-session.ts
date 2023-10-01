import { cache } from 'react';
import { handlePageAuthRequest } from './handle-auth-request';

/**
 * This allows you share the session across pages and layouts, making it possible to validate the request in
 * multiple layouts and page files without making unnecessary database calls.
 * @see {@link https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nextjs-app} for more information.
 */
export const getPageSession = cache(() => {
  const authRequest = handlePageAuthRequest();
  return authRequest.validate();
});
