import { generateImagekitSignature } from '$lib/signature';
import { v4 as uuidv4 } from 'uuid';

export async function get(): Promise<{ status: number; body: unknown }> {
  const token = uuidv4();
  const expire = Math.round(Number(Date.now()) / 1000) + 2400;
  const signature = generateImagekitSignature({ token: token, expire: expire });

  const response = {
    body: {
      token: token,
      expire: expire,
      signature: signature,
    },
    status: 200,
  };

  return response;
}
