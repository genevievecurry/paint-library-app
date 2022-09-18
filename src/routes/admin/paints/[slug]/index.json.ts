import { createPaint } from '$lib/api';

export async function post({
  request,
  locals,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const body = await request.json();
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await createPaint(body, locals.user);

  return response;
}
