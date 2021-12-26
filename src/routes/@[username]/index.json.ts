import * as api from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { uuid, username } = params;
  const response = await api.getUserProfile(username);
  return response;
}
