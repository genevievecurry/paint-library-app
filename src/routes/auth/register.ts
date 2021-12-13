import * as api from '$lib/api';

export async function post({ body, token }) {
  const response = await api.createUser(body);
  return response;
}
