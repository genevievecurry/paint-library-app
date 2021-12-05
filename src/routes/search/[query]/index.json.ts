import * as api from '$lib/api';

export async function get({ params }): Promise<{ status: number; body: unknown }> {
  const { query } = params;
  const response = await api.getResults(query);

  return response;
}
