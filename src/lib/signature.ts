import { createHmac } from 'crypto';

function signature(privateKey: string, token: string, expire: number) {
  return createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');
}

type signatureOptions = { token: string; expire: number };

export const generateImagekitSignature = ({
  token,
  expire,
}: signatureOptions): string => {
  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_API_KEY;
  return signature(privateKey, token, expire);
};
