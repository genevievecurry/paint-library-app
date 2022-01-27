import { getAllPigments, getAllPigmentsByColor } from '$lib/api';

export async function get({ url }): Promise<{ status: number; body: unknown }> {
  const { searchParams } = url;

  let response;

  if (searchParams.has('query')) {
    response = await getAllPigments(searchParams);
  } else if (searchParams.has('byColor')) {
    response = await getAllPigmentsByColor();
  } else {
    response = await getAllPigments();
  }

  if (response.status === 500) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
