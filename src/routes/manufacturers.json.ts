import { getAllManufacturers } from '$lib/api';

export async function get({ url }): Promise<{ status: number; body: unknown }> {
  const { searchParams } = url;


  const response = await getAllManufacturers(searchParams);

  if (response.status === 500) {
    return {
      status: response.status,
      body: {},
    };
  }
  return response;
}