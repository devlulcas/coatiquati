import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import { google } from '@lucia-auth/oauth/providers';
import { auth } from './auth';

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'google-oauth-state';

export const googleAuth = google(auth, {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: GOOGLE_REDIRECT_URI
});
