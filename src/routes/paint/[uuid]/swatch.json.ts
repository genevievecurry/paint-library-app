import * as api from '$lib/api';

export async function post({ body: data, locals, params }) {
  if (!locals.user) {
    return {
      status: 401,
    };
  }
  const { uuid } = params;
  let response;

  if (!data.id) {
    response = await api.createSwatchCard(uuid, data);
  } else {
    response = await api.updateSwatchCard(data);
  }

  return response;
}
