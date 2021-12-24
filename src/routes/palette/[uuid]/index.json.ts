import * as api from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { uuid } = params;
  const response = await api.getPalette(uuid);

  return response;
}

export async function post({ body: data, locals, params }) {
  if (!locals.user) {
    return {
      status: 401,
    };
  }
  const { uuid } = params;
  const response = await api.updatePalette(uuid, data, locals.user);

  return response;
}

export async function del({ params }) {
  const { uuid } = params;
  const response = await api.deletePalette(uuid);

  return response;
}
