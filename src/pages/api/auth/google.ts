import type { APIRoute } from 'astro';

import { createGoogleOAuth } from '@/lib/auth/google';
import { generateState } from '@/lib/auth/session';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    const google = createGoogleOAuth();
    const state = generateState();

    // Store state in a cookie for verification in the callback
    cookies.set('google_oauth_state', state, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    });

    const url = google.createAuthorizationURL(state, ['openid', 'profile', 'email']);

    return redirect(url.toString());
  } catch (error) {
    console.error('Error initiating Google OAuth:', error);
    return new Response('Failed to initiate Google OAuth', { status: 500 });
  }
};
