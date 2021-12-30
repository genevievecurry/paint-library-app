import * as api from '$lib/api';

export async function get(): Promise<{ status: number; body: unknown }> {
  const response = await api.getAllPalettes();

  if (response.status === 500) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}
