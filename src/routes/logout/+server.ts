import { Session } from '$lib/server/db/objects/Session';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { session: userSession, db } = event.locals;
	if (!userSession) return redirect(302, '/login');

	const session = new Session(db);

	await session.invalidate(userSession.id);
	session.deleteSessionTokenCookie(event);

	return redirect(302, '/login');
};
