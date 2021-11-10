function uuidv4() {
  return ([1e2] + -1e3).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

type slugOptions = { value: string, uuid?: boolean }

export const generateSlug = ({ value, uuid = false }: slugOptions): string => {
  const result = value
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')

	if (uuid === true){
		return result.concat(`-${uuidv4()}`);
	}

	return result;
};
