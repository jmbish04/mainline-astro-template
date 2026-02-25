import { Google } from 'arctic';

export function createGoogleOAuth() {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${import.meta.env.PUBLIC_APP_URL}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
  }

  return new Google(clientId, clientSecret, redirectUri);
}
