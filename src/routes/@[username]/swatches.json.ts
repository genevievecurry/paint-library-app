import { getUserProfileSwatches } from '$lib/api';

export async function get({
  params,
}: RequestEvent): Promise<{ status: number; body: Record<string, unknown> }> {
  const { username } = params;
  const response = await getUserProfileSwatches(username);
  return response;
}
