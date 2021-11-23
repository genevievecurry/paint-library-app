// export const imagekitPrivateApiKey = process.env['VITE_IMAGEKIT_PRIVATE_API_KEY'] || 'blahblahblah'
export const imagekitPrivateApiKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_API_KEY;
export const imagekitPublicApiKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_API_KEY;
export const baseURL = import.meta.env.VITE_BASE_URL;
