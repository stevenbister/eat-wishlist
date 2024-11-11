import { and, eq, or } from 'drizzle-orm';
import type { DbClient } from './connection';
import { establishment } from './schema/establishment';
import { user } from './schema/user';
import { userFriend } from './schema/userFriend';
import { TableCommon } from './TableCommon';

export class Establishment extends TableCommon<typeof establishment> {
	constructor(db: DbClient) {
		super(db, establishment);
	}

	private fields = {
		id: this.schema.id,
		name: this.schema.name,
		website: this.schema.website,
		visited: this.schema.visited,
		createdAt: this.schema.createdAt,
		createdBy: {
			id: user.id,
			name: user.name
		}
	};

	private filterByOwner = (currentUserId: string) => eq(this.schema.createdBy, currentUserId);

	private filterByFriends = (currentUserId: string) =>
		or(
			and(
				eq(userFriend.userId1, currentUserId),
				eq(this.schema.createdBy, userFriend.userId2),
				eq(userFriend.status, 'friend')
			),
			and(
				eq(userFriend.userId2, currentUserId),
				eq(this.schema.createdBy, userFriend.userId1),
				eq(userFriend.status, 'friend')
			)
		);

	async getOwn(currentUserId: string) {
		return await this.db
			.select(this.fields)
			.from(this.schema)
			.innerJoin(user, eq(this.schema.createdBy, user.id))
			.where(this.filterByOwner(currentUserId));
	}

	async getFriends(currentUserId: string) {
		return await this.db
			.select(this.fields)
			.from(this.schema)
			.innerJoin(user, eq(this.schema.createdBy, user.id))
			.innerJoin(userFriend, this.filterByFriends(currentUserId));
	}
}
