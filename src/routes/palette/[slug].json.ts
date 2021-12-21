import * as api from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { slug } = params;
  const response = await api.getPalette(slug)

  return response;
}

export async function post({ body: data, locals, params }) {
  if (!locals.user) {
    return {
      status: 401,
    };
  }
  const { slug } = params;
  const response = await api.updatePalette(slug, data, locals.user)

  return response;
}