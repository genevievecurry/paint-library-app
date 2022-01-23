import * as api from '$lib/api';

export async function get({
  url,
  locals,
}): Promise<{ status: number; body: unknown }> {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await api.getUsers(url.searchParams);

  if (response.status !== 200) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}

export async function post({ body, locals }) {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }

  const response = await api.updateUser(body.formData, body.user);

  return response;
}

export async function del({ locals, body: data}) {
  if (locals.user?.role !== 'ADMIN') {
    return {
      body: { message: 'unauthorized' },
      status: 401,
    };
  }
  const response = await api.deleteUser(data);

  return response;
}
