import * as api from '$lib/api';

export async function get({ url }): Promise<{ status: number; body: unknown }> {
  const response = await api.getPaints(url.searchParams);

  if (response.status === 404) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
