import * as api from '$lib/api';

export async function post({ body: data, locals }) {
  if (!locals.user) {
    return {
      status: 401,
    };
  }
  const response = await api.updateUser(data, locals.user);

  // Update token with new deets
  if (response.status === 200) {
    const json = JSON.stringify(response.body);
    const token = Buffer.from(json).toString('base64');

    return {
      headers: {
        'set-cookie': `jwt=${token}; Path=/; HttpOnly`,
      },
      body: response.body,
      status: response.status,
    };
  } else {
    return {
      body: null,
      status: response.status,
    }
  }
}
