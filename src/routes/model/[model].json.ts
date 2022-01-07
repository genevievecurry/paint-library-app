import * as api from '$lib/api';

export async function get({
  params,
  url,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { model } = params;
  const response = await api.getOption(model, url.searchParams);

  if (response.status === 404) {
    return {
      status: response.status,
      body: {},
    };
  }

  return response;
}
