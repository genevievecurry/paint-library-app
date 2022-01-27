import * as api from '$lib/api';

export async function get({
  url,
  locals,
}): Promise<{ status: number; body: unknown }> {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await api.getAllNotes(url.searchParams);

  if (response.status !== 200) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
