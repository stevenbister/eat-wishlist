import { VALIDATION_MESSAGE } from '$lib/constants/auth';
import { Session } from '$lib/server/db/Session';
import { User } from '$lib/server/db/User';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async (event) => {
		const { db } = event.locals;
		const user = new User(db);
		const session = new Session(db);

		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!user.validateEmail(email)) return fail(400, { message: VALIDATION_MESSAGE.INVALID_EMAIL });

		if (!user.validatePassword(password))
			return fail(400, {
				message: VALIDATION_MESSAGE.INVALID_PASSWORD
			});

		const results = await user.getByEmail(email);

		const existingUser = results.at(0);
		if (!existingUser)
			return fail(400, { message: VALIDATION_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD });

		const isCorrectPassword = user.verifyPassword(existingUser.password, password);
		if (!isCorrectPassword)
			return fail(400, { message: VALIDATION_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD });

		const sessionToken = session.generateToken();
		const newSession = await session.create(sessionToken, existingUser.id);
		session.setSessionTokenCookie(event, sessionToken, newSession.expiresAt);

		return redirect(302, '/');
	},
	register: async (event) => {
		const { db } = event.locals;
		const user = new User(db);
		const session = new Session(db);

		const formData = await event.request.formData();
		const name = formData.get('name');
		if (!user.validateName(name)) return fail(400, { message: VALIDATION_MESSAGE.GENERIC });

		const email = formData.get('email');
		if (!user.validateEmail(email)) return fail(400, { message: VALIDATION_MESSAGE.INVALID_EMAIL });

		const password = formData.get('password');
		if (!user.validatePassword(password))
			return fail(400, {
				message: VALIDATION_MESSAGE.INVALID_PASSWORD
			});

		const results = await user.getByEmail(email);

		const existingUser = results.at(0);
		if (existingUser) return fail(400, { message: VALIDATION_MESSAGE.USER_ALREADY_EXISTS });

		try {
			const newUser = await user.createUser({ name, email, password });

			const sessionToken = session.generateToken();
			const newSession = await session.create(sessionToken, newUser.id);
			session.setSessionTokenCookie(event, sessionToken, newSession.expiresAt);
		} catch (error) {
			console.error('ERROR', error);

			return fail(500, { message: 'An error has occurred' });
		}

		return redirect(302, '/');
	}
};
