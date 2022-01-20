import * as cookie from 'cookie';

export async function handle({ request, resolve }) {
  const cookies = cookie.parse(request.headers.cookie || '');
  const jwt =
    cookies.jwt && Buffer.from(cookies.jwt, 'base64').toString('utf-8');
  request.locals.user = jwt ? JSON.parse(jwt) : null;
  return await resolve(request);
}

export function getSession({ locals }) {
  return {
    user: locals.user && {
      username: locals.user.username,
      firstName: locals.user.firstName,
      lastName: locals.user.lastName,
      email: locals.user.email,
      role: locals.user.role,
      status: locals.user.status,
      uuid: locals.user.uuid,
    },
  };
}
