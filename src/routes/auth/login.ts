import * as api from '$lib/api';

export async function post({ body }) {
  const response = await api.getUser(body);
  const json = JSON.stringify(response.body);
  const token = Buffer.from(json).toString('base64');

  return {
    headers: {
      'set-cookie': `jwt=${token}; Path=/; HttpOnly`,
    },
    body: response.body,
    status: response.status,
  };
}
