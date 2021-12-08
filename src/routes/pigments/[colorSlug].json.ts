import * as api from '$lib/api';

export async function get({ params }): Promise<{ status: number; body: Record<string, unknown> }> {
  const { colorSlug } = params;
  const response = await api.getPigmentsByColor(colorSlug);

  return response;
}
