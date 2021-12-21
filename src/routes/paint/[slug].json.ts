import * as api from '$lib/api';

export async function get({
  params, locals
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { slug } = params;

  const response = await api.getPaint(slug, locals.user);

  return response;
}
