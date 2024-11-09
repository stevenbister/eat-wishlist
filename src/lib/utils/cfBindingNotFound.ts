import { error } from '@sveltejs/kit';

export function cfBindingNotFound(): ReturnType<typeof error> {
	return error(500, 'Cloudflare D1 binding not found');
}
