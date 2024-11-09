import { Establishment } from '$lib/server/db/Establishment';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return redirect(302, '/login');

	const { db } = locals;

	const establishments = new Establishment(db);

	const results = await establishments.listWithCreator();

	return {
		results
	};
};
