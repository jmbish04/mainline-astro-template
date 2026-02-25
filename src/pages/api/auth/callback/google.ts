import type { APIRoute } from 'astro';

import { createGoogleOAuth } from '@/lib/auth/google';
import { setSessionCookie } from '@/lib/auth/session';

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  try {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = cookies.get('google_oauth_state')?.value;

    // Validate state to prevent CSRF attacks
    if (!code || !state || !storedState || state !== storedState) {
      return new Response('Invalid OAuth state', { status: 400 });
    }

    // Clear the state cookie
    cookies.delete('google_oauth_state', { path: '/' });

    const google = createGoogleOAuth();

    // Exchange the authorization code for tokens
    const tokens = await google.validateAuthorizationCode(code);

    // Fetch user info from Google
    const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const googleUser: GoogleUser = await response.json();

    // Create session for the user
    setSessionCookie(cookies, {
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });

    // Redirect to the dashboard
    return redirect('/dashboard');
  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    return redirect('/login?error=auth_failed');
  }
};
