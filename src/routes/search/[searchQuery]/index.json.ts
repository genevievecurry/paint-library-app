import { getSearchResults } from '$lib/api';

export async function get({
  params,
  url,
}): Promise<{ status: number; body: unknown }> {
  const { searchQuery } = params;
  const response = await getSearchResults(searchQuery, url.searchParams);

  return response;
}
