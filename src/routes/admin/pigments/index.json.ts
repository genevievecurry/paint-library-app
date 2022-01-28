import { getAllPigments } from '$lib/api';

export async function get({
  locals,
}: RequestEvent): Promise<{ status: number; body: unknown }> {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await getAllPigments();
  if (response.status !== 200) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
