import { upsertPigment, getPigment } from '$lib/api';

export async function get({ locals, params }: RequestEvent): RequestEvent {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }
  const { slug } = params;
  const response = await getPigment(slug);
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

  const response = await upsertPigment(data);
  if (response.status !== 200) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
