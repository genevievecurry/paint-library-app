import { generateImagekitSignature } from "$lib/signature";
const crypto = await import('crypto');

export async function get(): Promise<{status: number; body: unknown}> {
  const token = crypto.randomUUID();
  const expire = parseInt(Date.now()/1000)+2400;
  const signature = generateImagekitSignature({ token: token, expire: expire })

  const response = {
    body: {
      token: token,
      expire: expire,
      signature: signature
    }, 
    status: 200,
  }

  return response;
}