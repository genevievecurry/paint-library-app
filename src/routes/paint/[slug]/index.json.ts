import * as api from '$lib/api';

export async function get({ params }): Promise<{ status: number; body: Record<string, unknown> }> {
  const { slug } = params;
  const response = await api.get(slug);

  return response;
}
