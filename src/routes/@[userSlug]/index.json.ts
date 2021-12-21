import * as api from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { userSlug } = params;
  const response = await api.getUserProfile(userSlug);
  return response;

}
