import * as api from '$lib/api';

export async function post({ body }): Promise<{ status: number; body: Record<string, unknown> }> {

  const response = await api.post(body)

  if (response.status === 401) {
    return { status: response.status, body: response.body };
  }

  return response;
}


