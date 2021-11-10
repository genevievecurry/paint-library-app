import * as api from '$lib/api';

export async function get(): Promise<{ status: number; body: unknown }> {
  const response = await api.getSwatches();

  if (response.status === 404) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
