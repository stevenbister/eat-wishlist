import { error } from '@sveltejs/kit';

export function pageNotFound(): ReturnType<typeof error> {
	return error(404, 'Page not found');
}
