import { v4 as uuidv4 } from 'uuid';

type GenerateSlug = { value: string; uuid?: boolean };

export const generateSlug = ({ value, uuid = false }: GenerateSlug): string => {
  const result = value
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  if (uuid === true) {
    return result.concat(`-${uuidv4()}`);
  }

  return result;
};

export const generateUuid = () => {
  return uuidv4();
};

export function generateUrl({ prefix, target }): string {
  if (prefix && target.uuid && target.slug) {
    return `/${prefix}/${target.uuid}/${target.slug}`;
  }
  if (prefix && target.uuid) {
    return `/${prefix}/${target.uuid}`;
  }
  if (prefix && target.slug) {
    return `/${prefix}/${target.slug}`;
  }
  if (!prefix && target.slug) {
    return `/@${target.slug}`;
  }
}
