import { Session } from '$lib/server/db/Session';
import { User } from '$lib/server/db/User';
import { pageNotFound } from '$lib/utils/pageNotFound';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, locals }) => {
	if (platform?.env.ENVIRONMENT === 'production') pageNotFound();
	const { db } = locals;

	const session = new Session(db);
	const user = new User(db);

	console.log('Seeding data 🌱');

	console.log('Resetting tables...');

	await session.deleteAll();
	await user.deleteAll();

	console.log('Tables reset');

	console.log('Creating test users...');

	await user.createUser('test@test.com', 'moc5-p@ssWord');

	console.log('Test users created');

	console.log('Seeding finished 🌳');

	return new Response('OK', { status: 200 });
};
