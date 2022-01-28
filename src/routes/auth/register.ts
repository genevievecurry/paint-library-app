import { createUser } from '$lib/api';

export async function post({ body }): Promise<{
  body: User;
  status: number;
}> {
  const response = await createUser(body);
  return response;
}
