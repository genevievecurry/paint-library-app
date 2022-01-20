import * as api from '$lib/api';

export async function post({
  body,
  locals,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = await api.createPaint(body, locals.user);

  return response;
}
