import * as api from '$lib/api';

export async function post({
  body,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = await api.updateSwatchCard(body);

  return response;
}
