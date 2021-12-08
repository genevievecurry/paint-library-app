import * as api from '$lib/api';

export async function get({ params }): Promise<{ status: number; body: Record<string, unknown> }> {
  const { pigmentSlug } = params;
  const response = await api.getPigment(pigmentSlug);

  return response;
}
