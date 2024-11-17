import { Establishment } from '$lib/server/db/Establishment';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { db, user } = locals;

		const establishment = new Establishment(db);

		const formData = await request.formData();
		const name = formData.get('name');
		const website = formData.get('website');

		if (!name || typeof name !== 'string') return fail(400, { message: 'Name is required' });

		if (typeof website !== 'string') return fail(400, { message: 'Website is required' });

		establishment.addNew({
			currentUserId: user!.id,
			name,
			website
		});
	}
};
