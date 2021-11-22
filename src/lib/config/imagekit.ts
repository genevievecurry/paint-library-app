import ImageKit from "imagekit-javascript";
import { imagekitPublicApiKey } from '$lib/config/secrets';

const imagekit = new ImageKit({
  publicKey: imagekitPublicApiKey,
  urlEndpoint: "https://ik.imagekit.io/paintlibrary/",
  authenticationEndpoint: "/auth.json",
});

export default imagekit;