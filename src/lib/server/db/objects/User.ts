import { encodeBase32LowerCase } from '@oslojs/encoding';
import { error } from '@sveltejs/kit';
import bycrypt from 'bcrypt-edge';
import { eq } from 'drizzle-orm';
import type { DbClient } from '../connection';
import { user } from '../schema/user';
import { TableCommon } from './TableCommon';

export class User extends TableCommon<typeof user> {
	constructor(db: DbClient) {
		super(db, user);
	}

	getByEmail(email: string) {
		return this.db.select().from(this.schema).where(eq(this.schema.email, email));
	}

	hashPassword(password: string) {
		return bycrypt.hashSync(password, 8);
	}

	verifyPassword(hash: string, password: string) {
		return bycrypt.compareSync(password, hash);
	}

	async createUser(email: string, password: string) {
		const passwordHash = this.hashPassword(password);
		const userId = this.generateId();

		const [{ id, email: userEmail }] = await this.db
			.insert(this.schema)
			.values({ id: userId, email, password: passwordHash })
			.returning();

		if (!id) error(500, 'User could not be created');

		return {
			id,
			email: userEmail
		};
	}

	generateId() {
		// ID with 120 bits of entropy, or about the same as UUID v4.
		const bytes = crypto.getRandomValues(new Uint8Array(15));
		const id = encodeBase32LowerCase(bytes);

		return id;
	}

	validateEmail(email: unknown): email is string {
		if (typeof email !== 'string') return false;

		return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
	}

	validatePassword(password: unknown): password is string {
		return (
			typeof password === 'string' &&
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(password) &&
			password.length >= 6 &&
			password.length <= 255
		);
	}
}
