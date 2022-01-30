import { createSwatchCard, updateSwatchCard, deleteSwatchCard } from '$lib/api';

export async function post({ body: data, locals, params }) {
  if (!locals.user) {
    return {
      status: 401,
    };
  }
  const { uuid } = params;
  let response;

  if (!data.id) {
    response = await createSwatchCard(uuid, data);
  } else {
    response = await updateSwatchCard(uuid, data);
  }

  return response;
}

export async function del({ url }) {
  const response = await deleteSwatchCard(url.searchParams);

  return response;
}
