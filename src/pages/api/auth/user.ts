import type { APIRoute } from 'astro';

import { getSessionUser } from '@/lib/auth/session';

export const GET: APIRoute = async ({ cookies }) => {
  const user = getSessionUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
