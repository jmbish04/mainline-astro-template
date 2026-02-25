import type { AstroCookies } from 'astro';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setSessionCookie(cookies: AstroCookies, user: SessionUser) {
  const sessionData = JSON.stringify(user);
  cookies.set(SESSION_COOKIE_NAME, sessionData, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  });
}

export function getSessionUser(cookies: AstroCookies): SessionUser | null {
  const sessionCookie = cookies.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
  });
}

export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
