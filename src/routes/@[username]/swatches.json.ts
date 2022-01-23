import * as api from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { username } = params;
  const response = await api.getUserProfileSwatches(username);
  return response;
}
