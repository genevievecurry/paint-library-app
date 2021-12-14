import * as api from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: unknown }> {
  const { query } = params;
  const response = await api.getSearchResults(query);

  return response;
}
