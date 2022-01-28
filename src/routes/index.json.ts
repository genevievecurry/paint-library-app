import { getPaints } from '$lib/api';

export async function get({
  url,
}: RequestEvent): Promise<{ status: number; body: unknown }> {
  const response = await getPaints(url.searchParams);
  if (response.status === 404) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
