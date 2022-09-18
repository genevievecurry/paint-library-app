import * as api from '$lib/api';

export async function post({ request }): Promise<{
  body: User;
  status: number;
}> {
  const body = await request.json()
  const response = await api.createPalette(body);
  
  return response;
}
