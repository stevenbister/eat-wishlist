import { Establishment } from '$lib/server/db/Establishment';
import { List } from '$lib/server/db/List';
import { Session } from '$lib/server/db/Session';
import { User } from '$lib/server/db/User';
import { UserFriend } from '$lib/server/db/UserFriend';
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
	},
	{
		name: 'Test',
		email: 'test@test.com',
		password: 'moc5-p@ssWord'
	}
];

export const GET: RequestHandler = async ({ platform, locals }) => {
	if (platform?.env.ENVIRONMENT === 'production') pageNotFound();
	const { db } = locals;

	const session = new Session(db);
	const user = new User(db);
	const userFriend = new UserFriend(db);
	const list = new List(db);
	const establishment = new Establishment(db);

	console.log('Seeding data 🌱');

	console.log('Resetting tables...');

	await session.deleteAll();
	await user.deleteAll();
	await userFriend.deleteAll();

	console.log('Tables reset');

	console.log('Creating test users...');

	const userList = [];
	for (const { name, email, password } of users) {
		const testUser = await user.createUser({ email, password, name });
		userList.push(testUser);
	}

	console.log('Test users created');

	console.log('Creating friends...');

	await userFriend.request(userList[0].id, userList[1].id);
	const pendingRequests = await userFriend.getPendingRequests(userList[1].id);
	await userFriend.acceptRequest(pendingRequests.at(0)!.id);

	console.log('Friends created');

	console.log('Creating lists...');

	const newLists = await list.add([
		{
			name: 'Default',
			createdBy: userList[0].id
		},
		{
			name: 'Default',
			createdBy: userList[1].id
		},
		{
			name: 'Default',
			createdBy: userList[2].id
		}
	]);

	console.log('Lists created');

	console.log('Creating establishments...');

	await establishment.add([
		{
			name: 'Burger King',
			notes: 'Burgers are delicious',
			website: 'https://www.burgerking.com',
			visited: true,
			createdBy: userList[0].id,
			listId: newLists[0].id
		},
		{
			name: 'McDonalds',
			notes: 'Burgers are delicious',
			website: 'https://www.mcdonalds.com',
			createdBy: userList[0].id,
			listId: newLists[0].id
		},
		{
			name: 'KFC',
			notes: 'Burgers are delicious',
			website: 'https://www.kfc.com',
			createdBy: userList[1].id,
			listId: newLists[1].id
		},
		{
			name: 'Taco Bell',
			notes: 'Burgers are delicious',
			website: 'https://www.tacobell.com',
			createdBy: userList[2].id,
			listId: newLists[2].id
		}
	]);

	console.log('Establishments created');

	console.log('Seeding finished 🌳');

	return new Response('OK', { status: 200 });
};
