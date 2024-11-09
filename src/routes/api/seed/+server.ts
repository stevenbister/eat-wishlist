import { Session } from '$lib/server/db/Session';
import { User } from '$lib/server/db/User';
import { pageNotFound } from '$lib/utils/pageNotFound';
import type { RequestHandler } from './$types';

const users = [
	{
		name: 'Steven',
		email: 'steven@test.com',
		password: 'moc5-p@ssWord'
	},
	{
		name: 'Grace',
		email: 'grace@test.com',
		password: 'moc5-p@ssWord'
	}
];

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

	for (const { name, email, password } of users) {
		await user.createUser({ email, password, name });
	}

	console.log('Test users created');

	console.log('Seeding finished 🌳');

	return new Response('OK', { status: 200 });
};
