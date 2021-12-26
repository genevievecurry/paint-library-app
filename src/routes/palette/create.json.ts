import * as api from '$lib/api';

export async function post({ body }): Promise<{
  body: User;
  status: number;
}> {
  const response = await api.createPalette(body);
  return response;
}
