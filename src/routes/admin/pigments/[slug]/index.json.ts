import * as api from '$lib/api';

export async function get({
  locals,
  params,
}): Promise<{ status: number; body: unknown }> {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }
  const { slug } = params;
  const response = await api.getPigment(slug);
  if (response.status !== 200) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}

export async function post({ body: data, locals }) {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await api.upsertPigment(data);
  if (response.status !== 200) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
