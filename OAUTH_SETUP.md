# Google OAuth Setup Guide

This template includes Google OAuth authentication. Follow these steps to set it up:

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application** as the application type
6. Configure the OAuth consent screen if you haven't already:
   - Add your application name
   - Add your support email
   - Add authorized domains
7. Add authorized redirect URIs:
   - For development: `http://localhost:4321/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
8. Copy your **Client ID** and **Client Secret**

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Google OAuth credentials in `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   PUBLIC_APP_URL=http://localhost:4321
   SESSION_SECRET=your_random_session_secret_here
   ```

3. For production (Cloudflare Workers), set these environment variables in your Cloudflare dashboard or using Wrangler:
   ```bash
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   wrangler secret put SESSION_SECRET
   ```

   And set the public variable:
   ```bash
   # In wrangler.jsonc, add:
   "vars": {
     "PUBLIC_APP_URL": "https://yourdomain.com"
   }
   ```

## 3. Test the OAuth Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` or `/signup`
3. Click the "Sign in with Google" or "Sign up with Google" button
4. Complete the Google authentication flow
5. You should be redirected back to the home page

## How It Works

The OAuth flow consists of:

1. **Initiation**: When users click the Google button, they're redirected to `/api/auth/google`
2. **Authorization**: The endpoint generates a secure state token and redirects to Google's OAuth page
3. **Callback**: After user consent, Google redirects to `/api/auth/callback/google` with an authorization code
4. **Token Exchange**: The callback endpoint exchanges the code for access tokens
5. **User Info**: Fetch user profile information from Google
6. **Session Creation**: Create a secure session cookie with user data
7. **Redirect**: Redirect the user to the home page

## Session Management

User sessions are stored in HTTP-only cookies for security. The session includes:
- User ID (Google sub)
- Email
- Name
- Profile picture URL

Sessions expire after 7 days.

## Accessing User Session

To access the current user's session in your Astro pages or API routes:

```typescript
import { getSessionUser } from '@/lib/auth/session';

// In an Astro page
const user = getSessionUser(Astro.cookies);

// In an API route
export const GET: APIRoute = async ({ cookies }) => {
  const user = getSessionUser(cookies);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ... your code
};
```

## Logout

Users can logout by navigating to `/api/auth/logout` which clears the session and redirects to the login page.

## Security Considerations

- State parameter prevents CSRF attacks
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- Session expiration after 7 days
- Credentials stored as environment variables, never in code
