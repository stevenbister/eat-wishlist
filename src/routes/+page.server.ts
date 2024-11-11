import { Establishment } from '$lib/server/db/Establishment';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	if (!user) return redirect(302, '/login');

	const { db } = locals;

	const establishments = new Establishment(db);

	const ownEstablishments = await establishments.getOwn(user.id);
	const friendsEstablishments = await establishments.getFriends(user.id);

	const establishmentList = [...ownEstablishments, ...friendsEstablishments].toSorted(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	);

	return {
		establishmentList
	};
};
