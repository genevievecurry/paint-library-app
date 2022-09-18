import { getUser } from '$lib/api';

export async function post({ request }) {
  const body = await request.json()
  const response = await getUser(body);
  const json = JSON.stringify(response.body);
  const token = Buffer.from(json).toString('base64');

  return {
    headers: {
      credentials: 'same-origin',
      'set-cookie': `jwt=${token}; path=/; HttpOnly; SameSite=Lax; Secure`,
    },
    body: response.body,
    status: response.status,
  };
}
