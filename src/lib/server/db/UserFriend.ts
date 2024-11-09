import { ERROR_MESSAGE } from '$lib/constants/friends';
import { fail } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';
import type { DbClient } from './connection';
import { user } from './schema/user';
import { userFriend } from './schema/userFriend';
import { TableCommon } from './TableCommon';
import { User } from './User';

export class UserFriend extends TableCommon<typeof userFriend> {
	private user = new User(this.db);
	private isFriend = eq(this.schema.status, 'friend');
	private isRequest = (status: 'req_uid1' | 'req_uid2') => eq(this.schema.status, status);
	private matchesUserId1 = (userId: string) => eq(this.schema.userId1, userId);
	private matchesUserId2 = (userId: string) => eq(this.schema.userId2, userId);

	constructor(db: DbClient) {
		super(db, userFriend);
	}

	private async userNotFound(userId: string) {
		if ((await this.user.getById(userId)) === null)
			return fail(400, { message: ERROR_MESSAGE.NOT_FOUND });
	}

	async request(userId1: string, userId2: string) {
		this.userNotFound(userId1);
		this.userNotFound(userId2);

		if (userId1 === userId2) return fail(400, { message: ERROR_MESSAGE.SELF });

		const existingRequest = await this.db
			.select()
			.from(this.schema)
			.where(
				or(
					and(this.matchesUserId1(userId1), this.matchesUserId2(userId2)),
					and(this.matchesUserId1(userId2), this.matchesUserId2(userId1))
				)
			);

		if (existingRequest.length) return fail(400, { message: ERROR_MESSAGE.EXISTING_REQUEST });

		return this.add([{ userId1, userId2, status: 'req_uid1' }]);
	}

	async getPendingRequests(userId: string) {
		this.userNotFound(userId);

		return await this.db
			.select()
			.from(this.schema)
			.where(
				or(
					and(this.matchesUserId1(userId), this.isRequest('req_uid2')),
					and(this.matchesUserId2(userId), this.isRequest('req_uid1'))
				)
			);
	}

	async acceptRequest(pendingReqId: number) {
		return await this.db
			.update(this.schema)
			.set({ status: 'friend' })
			.where(eq(this.schema.id, pendingReqId))
			.returning();
	}

	async rejectRequest(pendingReqId: number) {
		return this.deleteById(pendingReqId);
	}

	async list(userId: string) {
		this.userNotFound(userId);

		return await this.db
			.select({
				id: this.schema.id,
				userId: user.id,
				name: user.name
			})
			.from(this.schema)
			.where(
				or(
					and(this.matchesUserId1(userId), this.isFriend),
					and(this.matchesUserId2(userId), this.isFriend)
				)
			)
			.innerJoin(
				user,
				or(
					and(eq(user.id, this.schema.userId1), this.matchesUserId2(userId)),
					and(eq(user.id, this.schema.userId2), this.matchesUserId1(userId))
				)
			);
	}
}
