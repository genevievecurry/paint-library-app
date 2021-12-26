import * as api from '$lib/api';

export async function get({
  params,
  locals,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { slug, uuid } = params;

  const response = await api.getPaint(uuid, locals.user);

  return response;
}
