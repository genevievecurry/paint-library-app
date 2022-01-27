import * as api from '$lib/api';

export async function post({
  params,
  body: data,
  locals,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  if (!locals.user) {
    return {
      body: null,
      status: 401,
    };
  }

  const { uuid } = params;
  let response;

  if (!data.id) {
    response = await api.createNote(data, uuid, locals.user);
  } else {
    response = await api.updateNote(data);
  }

  return response;
}

export async function del({ body: data }) {
  const response = await api.deleteNote(data);

  return response;
}
