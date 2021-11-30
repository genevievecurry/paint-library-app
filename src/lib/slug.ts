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
