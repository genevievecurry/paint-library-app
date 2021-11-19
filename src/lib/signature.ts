const crypto = await import('crypto');

function signature(privateKey, token, expire) {
  return crypto.createHmac('sha1',privateKey).update(token+expire).digest('hex');
}

type signatureOptions = { token: string; expire: number};

export const generateImagekitSignature = ({ token, expire}: signatureOptions): string => {
  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_API_KEY;
  return signature(privateKey, token, expire)
}
