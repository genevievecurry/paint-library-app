import * as api from '$lib/api';

export async function get({
  query,
}): Promise<{ status: number; body: unknown }> {
  const response = await api.getPaints(query);

  if (response.status === 404) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
