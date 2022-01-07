import * as api from '$lib/api';

export async function get({
  params,
  url,
}): Promise<{ status: number; body: unknown }> {
  const { searchQuery } = params;
  const response = await api.getSearchResults(searchQuery, url.searchParams);

  return response;
}
