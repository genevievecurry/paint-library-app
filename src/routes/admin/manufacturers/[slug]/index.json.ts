import { upsertManufacturer } from '$lib/api';

export async function get({
  params,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const { slug } = params;
  const response = await api.getManufacturer(slug);

  return response;
}

export async function post({
  body,
  locals,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await upsertManufacturer(body);

  return response;
}
