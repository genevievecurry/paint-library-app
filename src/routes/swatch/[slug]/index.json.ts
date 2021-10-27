import * as api from './api';

export async function get({ params }):Promise<{status: number, body: Record<string, unknown>}> {
	const { slug } = params;

	const response = await api.get(slug);

	console.log("slug", slug);
	console.log("response", response);

	if(response.status === 404) {
		return {
			status: response.status,
			body: {productColorName: 'Missing, oh no'}
		}
	}
	return response;
}
