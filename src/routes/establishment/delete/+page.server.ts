import { Establishment } from '$lib/server/db/Establishment';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { db, user } = locals;

		const establishment = new Establishment(db);

		const formData = await request.formData();
		const id = formData.get('id');
		const createdBy = formData.get('createdBy');

		if (!id || typeof id !== 'string') return fail(400, { message: 'ID is required' });

		if (user!.id !== createdBy) return fail(401, { message: 'Unauthorized' });

		establishment.deleteById(id);

		return { message: 'Establishment deleted' };
	}
};
