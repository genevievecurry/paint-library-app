import * as api from '$lib/api';

export async function get({
  params,
  query,
}): Promise<{ status: number; body: unknown }> {
  const { searchQuery } = params;
  const response = await api.getSearchResults(searchQuery, query);

  return response;
}
