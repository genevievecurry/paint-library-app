import { createUser } from '$lib/api';

export async function post({ request }): Promise<{
  body: User;
  status: number;
}> {
  const body = await request.json();
  const response = await createUser(body);
  return response;
}
