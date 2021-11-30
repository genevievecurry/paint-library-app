import * as api from '$lib/api';

export async function post({ body }): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = await api.edit(body);

  return response;
}
