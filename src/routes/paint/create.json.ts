import * as api from '$lib/api';

export async function post({
  method,
  body,
  headers,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = await api.post(body);

  return response;
}
