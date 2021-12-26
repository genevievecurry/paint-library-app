import * as api from '$lib/api';

export async function get({ params }): Promise<{
  status: number;
  body: {
    currentColor: string;
    pigments: ListPigment[];
  };
}> {
  const { colorSlug } = params;
  const response = await api.getPigmentsByColor(colorSlug);

  return response;
}
